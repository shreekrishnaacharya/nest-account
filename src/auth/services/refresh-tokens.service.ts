import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { RefreshToken } from "../entities/refresh-token.entity";

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  public async findByRefreshTokenAndUserId(
    refreshToken: string,
    userId: string
  ): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: {
        refreshToken: refreshToken,
        user_id: userId,
      },
    });
  }

  public async findNonBlacklistedByUserId(
    userId: string
  ): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: {
        isBlacklisted: false,
        user_id: userId,
      },
    });
  }

  public async createNewRefreshToken(userId: string): Promise<RefreshToken> {
    const refreshToken: RefreshToken = this.refreshTokenRepository.create({
      refreshToken: uuid(),
      user_id: userId,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }
}
