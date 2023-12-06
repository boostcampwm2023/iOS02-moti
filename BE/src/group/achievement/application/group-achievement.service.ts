import { Injectable } from '@nestjs/common';
import { GroupAchievementRepository } from '../entities/group-achievement.repository';
import { UserBlockedGroupAchievementRepository } from '../entities/user-blocked-group-achievement.repository';
import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';
import { User } from '../../../users/domain/user.domain';
import { RejectGroupAchievementResponse } from '../dto/reject-group-achievement-response.dto';
import { NoSuchGroupAchievementException } from '../exception/no-such-group-achievement.exception';
import { InvalidRejectRequestException } from '../exception/invalid-reject-request.exception';
import { Transactional } from '../../../config/transaction-manager';
import { GroupAchievementCreateRequest } from '../dto/group-achievement-create-request';
import { GroupCategoryRepository } from '../../category/entities/group-category.repository';
import { ImageRepository } from '../../../image/entities/image.repository';
import { InvalidCategoryException } from '../../../achievement/exception/invalid-category.exception';
import { NoUserImageException } from '../../../achievement/exception/no-user-image-exception';
import { GroupRepository } from '../../group/entities/group.repository';
import { NoSuchGroupUserException } from '../exception/no-such-group-user.exception';
import { NoSuchAchievementException } from '../../../achievement/exception/no-such-achievement.exception';
import { UnauthorizedAchievementException } from '../../../achievement/exception/unauthorized-achievement.exception';
import { PaginateGroupAchievementRequest } from '../dto/paginate-group-achievement-request';
import { PaginateGroupAchievementResponse } from '../dto/paginate-group-achievement-response';
import { GroupAchievementResponse } from '../dto/group-achievement-response';
import { GroupAchievementDeleteResponse } from '../dto/group-achievement-delete-response';

@Injectable()
export class GroupAchievementService {
  constructor(
    private readonly groupAchievementRepository: GroupAchievementRepository,
    private readonly groupCategoryRepository: GroupCategoryRepository,
    private readonly groupRepository: GroupRepository,
    private readonly imageRepository: ImageRepository,
    private readonly userBlockedGroupAchievementRepository: UserBlockedGroupAchievementRepository,
  ) {}

  @Transactional()
  async reject(user: User, groupId: number, achievementId: number) {
    const achievement =
      await this.groupAchievementRepository.findById(achievementId);
    if (!achievement) throw new NoSuchGroupAchievementException();
    if (achievement.group.id !== groupId)
      throw new InvalidRejectRequestException();

    const userBlockedGroupAchievement =
      await this.userBlockedGroupAchievementRepository.saveUserBlockedGroupAchievement(
        new UserBlockedGroupAchievement(user, achievement),
      );

    return RejectGroupAchievementResponse.from(userBlockedGroupAchievement);
  }

  @Transactional({ readonly: true })
  async getAchievementDetail(user: User, achievementId: number) {
    const groupAchievementDetailResponse =
      await this.groupAchievementRepository.findAchievementDetailByIdAndBelongingGroup(
        achievementId,
        user.id,
      );

    if (!groupAchievementDetailResponse)
      throw new UnauthorizedAchievementException();
    return groupAchievementDetailResponse;
  }

  @Transactional()
  async create(
    user: User,
    groupId: number,
    achieveCreate: GroupAchievementCreateRequest,
  ) {
    const category = await this.getCategory(user.id, achieveCreate.categoryId);
    const image = await this.getUserImage(achieveCreate.photoId, user);
    const group = await this.getGroup(groupId, user);
    const achievement = achieveCreate.toModel(user, group, category, image);
    const saved =
      await this.groupAchievementRepository.saveAchievement(achievement);
    return this.getAchievementResponse(user.id, saved.id);
  }

  @Transactional({ readonly: true })
  async getAchievements(
    user: User,
    groupId: number,
    paginateGroupAchievementRequest: PaginateGroupAchievementRequest,
  ) {
    const achievements = await this.groupAchievementRepository.findAll(
      user.id,
      groupId,
      paginateGroupAchievementRequest,
    );
    return new PaginateGroupAchievementResponse(
      paginateGroupAchievementRequest,
      achievements.map((achievement) =>
        GroupAchievementResponse.from(achievement),
      ),
    );
  }
  private async getCategory(userId: number, ctgId: number) {
    if (ctgId === -1) return null;

    const ctg = await this.groupCategoryRepository.findByIdAndUser(
      userId,
      ctgId,
    );
    if (!ctg) throw new InvalidCategoryException();
    return ctg;
  }

  private async getUserImage(imageId: number, user: User) {
    const image = await this.imageRepository.findByIdAndUserAndNotAchievement(
      imageId,
      user,
    );

    if (!image) throw new NoUserImageException();
    return image;
  }

  private async getGroup(groupId: number, user: User) {
    const group = await this.groupRepository.findByIdAndUser(groupId, user);
    if (!group) throw new NoSuchGroupUserException();

    return group;
  }

  private async getAchievementResponse(userId: number, achieveId: number) {
    const achievement =
      await this.groupAchievementRepository.findAchievementDetailByIdAndUser(
        userId,
        achieveId,
      );
    if (!achievement) throw new NoSuchAchievementException();

    return achievement;
  }

  async delete(userId: number, groupId: number, achievementId: number) {
    const achievement = await this.getAchievement(
      achievementId,
      userId,
      groupId,
    );
    await this.groupAchievementRepository.repository.softDelete(achievement.id);
    return GroupAchievementDeleteResponse.from(achievement);
  }

  private async getAchievement(
    achieveId: number,
    userId: number,
    groupId: number,
  ) {
    const achievement =
      await this.groupAchievementRepository.findOneByIdAndUserAndGroup(
        achieveId,
        userId,
        groupId,
      );
    if (!achievement) throw new NoSuchGroupAchievementException();
    return achievement;
  }
}
