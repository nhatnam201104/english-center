// Backend/tests/utils/test-helpers.ts
import jwt from 'jsonwebtoken';

export const testHelpers = {
  // Tạo Buffer giả lập file ảnh
  createMockImage: (name: string) => {
    return {
      buffer: Buffer.from('fake-image-binary-data'),
      filename: `${name}.png`,
      content: 'image/png'
    };
  },

  // Tạo Token giả để bypass middleware Auth
  createAuthToken: (userId: number = 1) => {
    return jwt.sign(
      { id: userId, role: 'ADMIN' }, 
      process.env.JWT_SECRET || 'test-secret', 
      { expiresIn: '1h' }
    );
  }
};