import { IdentityToken } from './identity-token';

describe('IdentityToken test', () => {
  test('IdentityToken를 생성한다.', () => {
    const identityToken = new IdentityToken(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLm1vdGltYXRlLm1vdGkiLCJleHAiOjE5MjA1OTkxNjgsImlhdCI6MTY5OTYxMjczMiwic3ViIjoiMTIzNDU2LjEyNTU5ZWUxNTkyYjQ0YWY5NzA1ZmRhYmYyOGFlMzhiLjEyMzQiLCJjX2hhc2giOiJxSkd3ZEhyNEZYb055Qllobm5vQ21RIiwiYXV0aF90aW1lIjoxNjk5NjEyNzMyLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.hGOMbHw4R5poeuGb8igU15oP_oS8otDNTKqR1AGlTpxbHDs5HX848B8WA1TOqiM7sBb5zWFXPmvkRHu39DnymP83vG9Vsrc__iVRh2-mxJRd_83ligkaEY4OaqpfIChYVjKyXCKFpds4na0AasjebnZzSdZnhmIBG4nvxU8UPsNyUjHDibXRB37GJIsyCgvUmdPJeTNszxQtZZnMAGy9RYSXmeX2-7OeA15QBneY1PJk3vnaBdlmLiChR4FpiX42271h3C-28XEjcfjnw6u4RiggmQnYcGOCGcSG-dKhaizKSanZ6bti21qNAAFW4R2BVRy8E65wndKagI3J_ENMQQ',
    );
    expect(identityToken.header).toEqual({ alg: 'RS256', typ: 'JWT' });
    expect(identityToken.payload).toEqual({
      iss: 'https://appleid.apple.com',
      aud: 'com.motimate.moti',
      exp: 1920599168,
      iat: 1699612732,
      sub: '123456.12559ee1592b44af9705fdabf28ae38b.1234',
      c_hash: 'qJGwdHr4FXoNyBYhnnoCmQ',
      auth_time: 1699612732,
      nonce_supported: true,
    });
    expect(identityToken.signature).toEqual(
      'hGOMbHw4R5poeuGb8igU15oP_oS8otDNTKqR1AGlTpxbHDs5HX848B8WA1TOqiM7sBb5zWFXPmvkRHu39DnymP83vG9Vsrc__iVRh2-mxJRd_83ligkaEY4OaqpfIChYVjKyXCKFpds4na0AasjebnZzSdZnhmIBG4nvxU8UPsNyUjHDibXRB37GJIsyCgvUmdPJeTNszxQtZZnMAGy9RYSXmeX2-7OeA15QBneY1PJk3vnaBdlmLiChR4FpiX42271h3C-28XEjcfjnw6u4RiggmQnYcGOCGcSG-dKhaizKSanZ6bti21qNAAFW4R2BVRy8E65wndKagI3J_ENMQQ',
    );
  });
});
