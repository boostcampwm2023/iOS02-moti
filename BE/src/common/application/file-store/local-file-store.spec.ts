import { LocalFileStore } from './local-file-store';
import { Test, TestingModule } from '@nestjs/testing';
import { UuidHolderModule } from '../uuid-holder/uuid.module';
import { UuidHolder } from '../uuid-holder';
import { StubUuidHolder } from '../../../../test/common/uuid-holder/stub-uuid-holder';
import { FileStoreModule } from './file-store.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../../config/config';
import { FileFixture } from '../../../../test/common/file-store/file-fixture';
import * as path from 'path';
import * as fs from 'fs/promises';
import { FailFileTaskException } from './fail-file-task.exception';
import { FileStore } from './file-store';

describe('LocalFileStore', () => {
  const BASE_PATH = './motimate-test';

  let localFileStore: LocalFileStore;
  let uuidHolder: StubUuidHolder;

  beforeAll(async () => {
    await fs.rm(BASE_PATH, { recursive: true, force: true });
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        FileStoreModule,
        UuidHolderModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
    })
      .overrideProvider(UuidHolder)
      .useClass(StubUuidHolder)
      .compile();

    localFileStore = app.get<LocalFileStore>(FileStore);
    uuidHolder = app.get<StubUuidHolder>(UuidHolder);
  });

  afterEach(async () => {
    await fs.rm(BASE_PATH, { recursive: true, force: true });
  });

  describe('환경 테스트', () => {
    it('localFileStore가 정의되어 있어야 한다.', () => {
      expect(localFileStore).toBeDefined();
    });

    it('uuidHolder가 정의되어 있어야 한다.', () => {
      expect(uuidHolder).toBeDefined();
      expect(uuidHolder).toBeInstanceOf(StubUuidHolder);
    });
  });

  it('upload는 파일을 uuid로 저장시킬 수 있다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('test', 'jpg');

    // when
    const result = await localFileStore.upload(file);
    const filePath = path.join(BASE_PATH, result.uploadFileName);

    // then
    expect(result.originalFileName).toBe('test.jpg');
    expect(result.uploadFileName).toBe('aaaa-bbbb-cccc-dddd.jpg');
    expect(result.uploadFullPath.startsWith('file://')).toBeTruthy();
    expect(
      result.uploadFullPath.endsWith('aaaa-bbbb-cccc-dddd.jpg'),
    ).toBeTruthy();

    await expect(fs.access(filePath)).resolves.toBeUndefined();
  });

  it('upload는 파일을 uuid로 저장할 수 없는 경우 FailFileTaskException를 발생시킨다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');
    await fs.mkdir(path.join(BASE_PATH, 'aaaa-bbbb-cccc-dddd.jpg'), {
      recursive: true,
    });

    // when
    await expect(localFileStore.upload(file)).rejects.toThrow(
      FailFileTaskException,
    );
  });

  it('delete는 파일을 삭제할 수 있다.', async () => {
    // given
    uuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('text', 'jpg');
    const result = await localFileStore.upload(file);

    // when
    await localFileStore.delete(result.uploadFileName);

    // then
    await expect(fs.access(result.uploadFullPath)).rejects.toThrow();
  });

  it('delete는 존재하지 않는 경로에 대한 삭제 요청에 FailFileTaskException를 발생시킨다.', async () => {
    // given
    // when
    // then
    await expect(
      localFileStore.delete('./DO-NOT-USE-THIS-PATH/hi.jpg'),
    ).rejects.toThrow(FailFileTaskException);
  });
});
