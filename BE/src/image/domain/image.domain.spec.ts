import { LocalFileStore } from '../../common/application/file-store/local-file-store';
import { StubUuidHolder } from '../../../test/common/uuid-holder/stub-uuid-holder';
import { instance, mock, when } from 'ts-mockito';
import { ConfigService } from '@nestjs/config';
import { FileFixture } from '../../../test/common/file-store/file-fixture';
import { Image } from './image.domain';
import { UsersFixture } from '../../../test/user/users-fixture';
import { UploadFile } from '../../common/application/file-store';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('ImageDomain Test', () => {
  const IMAGE_FILESTORE_PREFIX = 'DO NOT USE THIS PATH';
  let fileSotre: LocalFileStore;
  let stubUuidHolder: StubUuidHolder;

  beforeAll(async () => {
    stubUuidHolder = new StubUuidHolder();

    const mockConfigService = mock<ConfigService>(ConfigService);
    when(mockConfigService.get('FILESTORE_PREFIX')).thenReturn('motimate-test');

    fileSotre = new LocalFileStore(stubUuidHolder, instance(mockConfigService));
  });

  afterEach(async () => {
    await fs.rm(path.join(process.cwd(), IMAGE_FILESTORE_PREFIX), {
      recursive: true,
      force: true,
    });
  });

  it('upload는 파일을 uuid로 저장시킬 수 있다.', async () => {
    // given
    const user = UsersFixture.user('123');
    const image = new Image(user);

    stubUuidHolder.setUuid('aaaa-bbbb-cccc-dddd');
    const file = FileFixture.file('test', 'jpg');

    // when
    const uploadFile: UploadFile = await image.uploadOriginalImage(
      file,
      fileSotre,
      IMAGE_FILESTORE_PREFIX,
    );

    // then
    expect(uploadFile.uploadFileName).toBe('aaaa-bbbb-cccc-dddd.jpg');
    expect(uploadFile.originalFileName).toBe('test.jpg');
    expect(uploadFile.uploadFullPath.startsWith('file://')).toBeTruthy();
    expect(
      uploadFile.uploadFullPath.endsWith('aaaa-bbbb-cccc-dddd.jpg'),
    ).toBeTruthy();
  });
});
