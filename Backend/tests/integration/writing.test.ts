import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/config/app';
import { testHelpers } from '../utils/test-helpers';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

describe('Writing Exam Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = testHelpers.createAuthToken();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/writing - Create Writing Exam', () => {
    it('nên tạo đề thi Writing thành công với dữ liệu hợp lệ', async () => {
      const response = await request(app)
        .post('/api/writing')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'TOEIC Writing Test 01',
          isActive: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('TOEIC Writing Test 01');
      expect(response.body.data.isActive).toBe(true);
      expect(response.body.data.id).toBeDefined();
    });

    it('nên trả về lỗi 400 khi name bị trống', async () => {
      const response = await request(app)
        .post('/api/writing')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          isActive: true,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Tên đề thi');
    });

    it('nên trả về lỗi 400 khi isActive không phải boolean', async () => {
      const response = await request(app)
        .post('/api/writing')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'TOEIC Writing Test 02',
          isActive: 'not-a-boolean',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/writing/:id - Get Writing Exam', () => {
    let writingExamId: number;

    beforeAll(async () => {
      // Create exam for this test suite
      const exam = await prisma.entranceExamWriting.create({
        data: {
          name: 'TOEIC Writing Test for GET',
          isActive: true,
        },
      });
      writingExamId = exam.id;
    });

    it('nên lấy đề thi thành công với ID hợp lệ', async () => {
      const response = await request(app)
        .get(`/api/writing/${writingExamId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(writingExamId);
    });

    it('nên trả về lỗi 404 khi ID không tồn tại', async () => {
      const response = await request(app)
        .get('/api/writing/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/writing/:id/part1/:index - Upsert Part 1 (5 Images)', () => {
    let writingExamId: number;

    beforeAll(async () => {
      const exam = await prisma.entranceExamWriting.create({
        data: {
          name: 'TOEIC Writing Test for Part1',
          isActive: true,
        },
      });
      writingExamId = exam.id;
    });

    it('nên upload đồng thời 5 ảnh thành công', async () => {
      const response = await request(app)
        .put(`/api/writing/${writingExamId}/part1/1`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('imageOne', Buffer.from('fake-image-1'), 'image1.png')
        .attach('imageTwo', Buffer.from('fake-image-2'), 'image2.png')
        .attach('imageThree', Buffer.from('fake-image-3'), 'image3.png')
        .attach('imageFour', Buffer.from('fake-image-4'), 'image4.png')
        .attach('imageFive', Buffer.from('fake-image-5'), 'image5.png');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.imageOne).toBeDefined();
    });

    it('nên verify DB lưu đúng 5 đường dẫn ảnh thông qua Prisma', async () => {
      const part1 = await prisma.writingOneToFive.findFirst({
        where: { writingExamId, index: 1 },
      });

      expect(part1).toBeTruthy();
      expect(part1?.imageOne).toBeDefined();
      expect(part1?.imageFive).toBeDefined();
    });
  });

  describe('PUT /api/writing/:id/part2/:index - Upsert Logic', () => {
    let writingExamId: number;
    let beforeUpdateCount: number;

    beforeAll(async () => {
      const exam = await prisma.entranceExamWriting.create({
        data: {
          name: 'TOEIC Writing Test for Part2',
          isActive: true,
        },
      });
      writingExamId = exam.id;

      // Tạo sẵn data để test upsert
      await prisma.writingSixSeven.create({
        data: {
          writingExam: {
            connect: { id: writingExamId }
          },
          index: 1,
          imageSix: 'old-image6.png',
          imageSeven: 'old-image7.png'
        }
      });

      beforeUpdateCount = await prisma.writingSixSeven.count({
        where: { writingExamId, index: 1 },
      });
    });

    it('nên update Part 2 ghi đè dữ liệu cũ khi cùng index', async () => {
      const response = await request(app)
        .put(`/api/writing/${writingExamId}/part2/1`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('imageSix', Buffer.from('updated-image-6'), 'updated-image6.png')
        .attach('imageSeven', Buffer.from('updated-image-7'), 'updated-image7.png');

      expect(response.status).toBe(200);
      
      const afterUpdateCount = await prisma.writingSixSeven.count({
        where: { writingExamId, index: 1 },
      });

      expect(afterUpdateCount).toBe(beforeUpdateCount);
      
      const updatedPart2 = await prisma.writingSixSeven.findFirst({
        where: { writingExamId, index: 1 },
      });
      expect(updatedPart2?.imageSix).toContain('updated-image-6');
    });
  });

  describe('DELETE /api/writing/:id - Cascade Delete', () => {
    let writingExamId: number;

    beforeAll(async () => {
      const exam = await prisma.entranceExamWriting.create({
        data: {
          name: 'TOEIC Writing Test for DELETE',
          isActive: true,
          writingOneToFives: {
            create: {
              index: 1,
              imageOne: 'test-image1.png',
              imageTwo: 'test-image2.png',
              imageThree: 'test-image3.png',
              imageFour: 'test-image4.png',
              imageFive: 'test-image5.png',
            }
          }
        },
      });
      writingExamId = exam.id;
    });

    it('nên xóa sạch các phần liên quan khi xóa đề thi chính', async () => {
      // Xóa đề thi
      const response = await request(app)
        .delete(`/api/writing/${writingExamId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify Cascade
      const part1Count = await prisma.writingOneToFive.count({
        where: { writingExamId },
      });
      const exam = await prisma.entranceExamWriting.findUnique({
        where: { id: writingExamId },
      });

      expect(part1Count).toBe(0);
      expect(exam).toBeNull();
    });
  });
});