import { StubUuidHolder } from '../../../../test/common/uuid-holder/stub-uuid-holder';
import { Test, TestingModule } from '@nestjs/testing';
import { FileStoreModule } from './file-store.module';
import { UuidHolderModule } from '../uuid-holder/uuid.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../../config/config';
import { UuidHolder } from '../uuid-holder';
import { ObjectStorageFileStore } from './object-storage-file-store';
import { FileStore } from './file-store';
import { FileFixture } from '../../../../test/common/file-store/file-fixture';
import { FailFileTaskException } from './fail-file-task.exception';
import { ciSkipTest } from '../../../../test/common/ci-skip-test';

(ciSkipTest ? describe.skip : describe)('ObjectStoreFileStore Test', () => {
  let objectStorageFileStore: ObjectStorageFileStore;
  let uuidHolder: StubUuidHolder;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        FileStoreModule,
        UuidHolderModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
    })
      .overrideProvider(UuidHolder)
      .useClass(StubUuidHolder)
      .overrideProvider(FileStore)
      .useClass(ObjectStorageFileStore)
      .compile();

    objectStorageFileStore = app.get<ObjectStorageFileStore>(FileStore);
    uuidHolder = app.get<StubUuidHolder>(UuidHolder);
  });

  afterEach(async () => {
    await objectStorageFileStore.delete('aaaa-bbbb-cccc-dddd.jpg');
    await objectStorageFileStore.delete('thumbnail/aaaa-bbbb-cccc-dddd.jpg');
  });

  describe('환경 테스트', () => {
    it('objectStorageFileStore가 정의되어 있어야 한다.', () => {
      expect(objectStorageFileStore).toBeDefined();
      expect(objectStorageFileStore).toBeInstanceOf(ObjectStorageFileStore);
    });

    it('uuidHolder가 정의되어 있어야 한다.', () => {
      expect(uuidHolder).toBeDefined();
      expect(uuidHolder).toBeInstanceOf(StubUuidHolder);
    });
  });

  it('upload는 기존 파일을 원하는 버킷에 업로드 시킬 수 있다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');

    // when
    const result = await objectStorageFileStore.upload(file);

    // then
    expect(result.uploadFileName).toBe('aaaa-bbbb-cccc-dddd.jpg');
    expect(result.originalFileName).toBe('text.jpg');
    expect(result.uploadFullPath.startsWith('https://')).toBeTruthy();
    expect(
      result.uploadFullPath.endsWith('aaaa-bbbb-cccc-dddd.jpg'),
    ).toBeTruthy();
  });

  it('upload는 기존 파일을 원하는 버킷에 업로드 시킬 수 있다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');

    // when
    const result = await objectStorageFileStore.upload(file, {
      basePath: 'thumbnail',
    });

    // then
    expect(result.uploadFileName).toBe('aaaa-bbbb-cccc-dddd.jpg');
    expect(result.originalFileName).toBe('text.jpg');
    expect(result.uploadFullPath.startsWith('https://')).toBeTruthy();
    expect(
      result.uploadFullPath.endsWith('thumbnail/aaaa-bbbb-cccc-dddd.jpg'),
    ).toBeTruthy();
  });

  it('upload는 존재하지 않는 버킷에 대한 저장 요청에 대해 FailFileTaskException를 발생시킨다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');

    // when
    await expect(
      objectStorageFileStore.upload(file, {
        prefix: 'app-test-thumbnail',
        basePath: 'thumbnail',
      }),
    ).rejects.toThrow(FailFileTaskException);
  });

  it('delete는 기존 파일을 원하는 버킷에서 삭제 시킬 수 있다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');
    const result = await objectStorageFileStore.upload(file);

    // when
    await expect(
      objectStorageFileStore.delete(result.uploadFileName),
    ).resolves.toBeUndefined();
  });

  it('delete는 존재하지 않는 버킷에 대한 삭제 요청에 FailFileTaskException를 발생시킨다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');
    const result = await objectStorageFileStore.upload(file);

    // when
    await expect(
      objectStorageFileStore.delete(result.uploadFileName, {
        prefix: 'app-test-thumbnail',
        basePath: 'thumbnail',
      }),
    ).rejects.toThrow(FailFileTaskException);
  });

  it('delete는 기존 파일을 원하는 버킷에서 삭제 시킬 수 있다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');
    const result = await objectStorageFileStore.upload(file, {
      basePath: 'thumbnail',
    });

    // when
    await expect(
      objectStorageFileStore.delete(result.uploadFileName),
    ).resolves.toBeUndefined();
  });
});
