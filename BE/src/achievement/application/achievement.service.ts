import { Injectable } from '@nestjs/common';
import { AchievementRepository } from '../entities/achievement.repository';
import { AchievementResponse } from '../dto/achievement-response';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { PaginateAchievementResponse } from '../dto/paginate-achievement-response';
import { AchievementDetailResponse } from '../dto/achievement-detail-response';
import { Transactional } from '../../config/transaction-manager';
import { NoSuchAchievementException } from '../exception/no-such-achievement.exception';
import { AchievementDeleteResponse } from '../dto/achievement-delete-response';
import { AchievementUpdateRequest } from '../dto/achievement-update-request';
import { CategoryRepository } from '../../category/entities/category.repository';
import { AchievementUpdateResponse } from '../dto/achievement-update-response';
import { Achievement } from '../domain/achievement.domain';
import { InvalidCategoryException } from '../exception/invalid-category.exception';
import { AchievementCreateRequest } from '../dto/achievement-create-request';
import { User } from '../../users/domain/user.domain';
import { ImageRepository } from '../../image/entities/image.repository';
import { NoUserImageException } from '../exception/no-user-image-exception';

@Injectable()
export class AchievementService {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  @Transactional({ readonly: true })
  async getAchievements(
    userId: number,
    paginateAchievementRequest: PaginateAchievementRequest,
  ) {
    const achievements = await this.achievementRepository.findAll(
      userId,
      paginateAchievementRequest,
    );
    return new PaginateAchievementResponse(
      paginateAchievementRequest,
      achievements.map((achievement) => AchievementResponse.from(achievement)),
    );
  }

  @Transactional({ readonly: true })
  async getAchievementDetail(userId: number, achievementId: number) {
    return this.getAchievementResponse(userId, achievementId);
  }

  @Transactional()
  async delete(userId: number, id: number) {
    const achievement = await this.getAchievement(userId, id);
    await this.achievementRepository.repository.softDelete(achievement.id);

    return AchievementDeleteResponse.from(achievement);
  }

  @Transactional()
  async update(
    userId: number,
    id: number,
    achieveUpdate: AchievementUpdateRequest,
  ) {
    const achievement = await this.getAchievement(userId, id);
    const category = await this.getCategory(userId, achieveUpdate.categoryId);

    achievement.update(achieveUpdate.toAchievementUpdate(category));
    await this.achievementRepository.saveAchievement(achievement);
    return AchievementUpdateResponse.from(achievement);
  }

  @Transactional()
  async create(user: User, achieveCreate: AchievementCreateRequest) {
    const category = await this.getCategory(user.id, achieveCreate.categoryId);
    const image = await this.getUserImage(achieveCreate.photoId, user);
    const achievement = achieveCreate.toModel(user, category, image);
    const saved = await this.achievementRepository.saveAchievement(achievement);
    return this.getAchievementResponse(user.id, saved.id);
  }

  private async getCategory(userId: number, ctgId: number) {
    const ctg = await this.categoryRepository.findByIdAndUser(userId, ctgId);
    if (!ctg) throw new InvalidCategoryException();
    return ctg;
  }

  private async getAchievement(userId: number, achieveId: number) {
    const achievement: Achievement =
      await this.achievementRepository.findByIdAndUser(userId, achieveId);
    if (!achievement) throw new NoSuchAchievementException();
    return achievement;
  }

  private async getUserImage(imageId: number, user: User) {
    const image = await this.imageRepository.findByIdAndUserAndNotAchievement(
      imageId,
      user,
    );

    if (!image) throw new NoUserImageException();
    return image;
  }

  private async getAchievementResponse(userId: number, achieveId: number) {
    const achievement: AchievementDetailResponse =
      await this.achievementRepository.findAchievementDetail(userId, achieveId);
    if (!achievement) throw new NoSuchAchievementException();

    return achievement;
  }
}
