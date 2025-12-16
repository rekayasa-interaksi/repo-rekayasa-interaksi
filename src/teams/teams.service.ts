import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPayloadDto } from 'src/users/dto/user-payload.dto';
import { Teams } from './entities/teams.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { Users } from 'src/users/entities/users.entitiy';
import { CreateVersionDto } from './dto/create-version.dto';
import { VersionSystems } from './entities/version-systems.entity';
import { QueryTeamDto } from './dto/query-team.dto';
import { UploadsService } from 'src/uploads/uploads.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { Features } from './entities/features.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,

    @InjectRepository(VersionSystems)
    private readonly versionSystemsRepository: Repository<VersionSystems>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Features)
    private readonly featuresRepository: Repository<Features>,
    private readonly uploadsService: UploadsService,
  ) {}

  async createTeam(createTeamDto: CreateTeamDto, userPayload: UserPayloadDto, files: {
    image?: Express.Multer.File[]
  }) {
    const user = await this.usersRepository.findOne({
      where: { id: createTeamDto.user_id },
      relations:  ['social_media'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const team = this.teamsRepository.create({
      role: createTeamDto.role,
      generation: createTeamDto.generation,
      user: user,
      created_at: new Date(),
      created_by: userPayload.sub,
      updated_at: new Date(),
    });


    if (files.image?.[0]) {
      const imageData = await this.uploadsService.saveFileData(files, 'teams');
      team.image_path = imageData.image;
    }

    const savedTeam = await this.teamsRepository.save(team);

    return {
      status: 'success',
      message: 'Teammate created successfully',
      data: savedTeam,
    }
  }

  async updateTeam(
    id: string,
    updateTeamDto: CreateTeamDto,
    userPayload: UserPayloadDto,
    files: {
      image?: Express.Multer.File[]
    }
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: updateTeamDto.user_id },
      relations:  ['social_media'],
    });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const team = await this.teamsRepository.findOne({ where: { id } });
    
    if (!team) {
      throw new BadRequestException('Team not found');
    }

    Object.assign(team, updateTeamDto);
    team.user = user;
    team.role = updateTeamDto.role
    team.generation = updateTeamDto.generation
    team.updated_at = new Date();
    team.created_by = userPayload.sub;
    
    if (files.image?.[0]) {
      if (team.image_path) {
        await this.uploadsService.deleteFileData(team.image_path);
      }
      const imageData = await this.uploadsService.saveFileData(files, 'teams');
      team.image_path = imageData.image;
    }
    
    const updatedTeam = await this.teamsRepository.save(team);
    return {
      status: 'success',
      message: 'Team updated successfully',
      data: updatedTeam,
    };
  }

  async deleteTeam(id: string) {
    const team = await this.teamsRepository.findOne({ where: { id } });
    
    if (!team) {
      throw new BadRequestException('Team not found');
    }

    if (team.image_path) {
      await this.uploadsService.deleteFileData(team.image_path);
    }
    
    await this.teamsRepository.remove(team);
    return {
      status: 'success',
      message: 'Team deleted successfully',
    };
  }

  async getGenerations() {
    const generations = await this.teamsRepository
      .createQueryBuilder('teams')
      .select('DISTINCT teams.generation', 'generation')
      .where('teams.generation IS NOT NULL')
      .orderBy('teams.generation', 'ASC')
      .getRawMany();
      
    const generationList = generations.map(gen => gen.generation);
    
    return {
      message: 'Generations retrieved successfully',
      data: generationList,
    };
  }

  async getAllTeams(queryDto: QueryTeamDto, userPayload: UserPayloadDto) {
    const { generation } = queryDto;

    const teams = await this.teamsRepository.find({
      where: { generation },
      relations: ['user', 'user.social_media'],
      order: { created_at: 'DESC' },
    });

    const isSuperAdmin = userPayload?.role === 'superadmin';

    return {
      status: 'success',
      message: 'Teams retrieved successfully',
      data: teams.map(team => {
        const baseResponse = {
          id: team.id,
          name: team.user?.name || null,
          role: team.role,
          generation: team.generation,
          image_path: team.image_path,
          image_url: team.image_path
            ? `${process.env.BASE_URL_STORAGE}${team.image_path}`
            : null,
          social_media: team.user?.social_media || null,
          created_at: team.created_at,
          updated_at: team.updated_at,
        };

        if (isSuperAdmin) {
          return {
            ...baseResponse,
            user_id: team.user?.id || null,
            user: team.user || null,
          };
        }

        return baseResponse;
      }),
    };
  }

  async createVersionSystem(createVersionDto: CreateVersionDto, userPayload: UserPayloadDto) {
    const version = this.versionSystemsRepository.create({
      ...createVersionDto,
      created_by: userPayload.sub,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedVersion = await this.versionSystemsRepository.save(version);

    return {
      status: 'success',
      message: 'Version created successfully',
      data: savedVersion,
    };
  }

  async updateVersionSystem(id: string, updateVersionDto: CreateVersionDto, userPayload: UserPayloadDto) {
    const version = await this.versionSystemsRepository.findOne({ where: { id } });
    
    if (!version) {
      throw new BadRequestException('Version not found');
    }

    Object.assign(version, updateVersionDto);
    version.updated_at = new Date();
    version.created_by = userPayload.sub;
    
    const updatedVersion = await this.versionSystemsRepository.save(version);
    return {
      status: 'success',
      message: 'Version updated successfully',
      data: updatedVersion,
    };
  }

  async deleteVersionSystem(id: string) {
    const version = await this.versionSystemsRepository.findOne({ where: { id } });
    
    if (!version) {
      throw new BadRequestException('Version not found');
    }
    await this.versionSystemsRepository.remove(version);
    
    return {
      status: 'success',
      message: 'Version deleted successfully',
    };
  }

  async getVersionSystems(queryDto: QueryTeamDto) {
    const { generation } = queryDto;

    const qb = this.versionSystemsRepository
      .createQueryBuilder('version_systems');

    if (generation) {
      qb.where('version_systems.generation = :generation', { generation });
    }

    const versions = await qb.getMany();

    return {
      status: 'success',
      message: 'Versions retrieved successfully',
      data: versions,
    };
  }

  async createFeature(featureDto: CreateFeatureDto, userPayload: UserPayloadDto) {
    const version = await this.versionSystemsRepository.findOne({ where: { id: featureDto.version_system_id } });

    if (!version) {
      throw new BadRequestException('Version not found');
    }

    const feature = this.featuresRepository.create({
      ...featureDto,
      version_system: version,
      created_by: userPayload.sub,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedFeature = await this.featuresRepository.save(feature);

    return {
      status: 'success',
      message: 'Feature created successfully',
      data: savedFeature,
    };
  }

  async updateFeature(id: string, featureDto: CreateFeatureDto, userPayload: UserPayloadDto) {
    const version = await this.versionSystemsRepository.findOne({ where: { id: featureDto.version_system_id } });

    if (!version) {
      throw new BadRequestException('Version not found');
    }

    const feature = await this.featuresRepository.findOne({ where: { id } });

    if (!feature) {
      throw new BadRequestException('Feature not found');
    }

    Object.assign(feature, featureDto);
    feature.version_system = version;
    feature.updated_at = new Date();
    feature.created_by = userPayload.sub;

    const updatedFeature = await this.featuresRepository.save(feature);
    return {
      status: 'success',
      message: 'Feature updated successfully',
      data: updatedFeature,
    };
  }

  async deleteFeature(id: string) {
    const feature = await this.featuresRepository.findOne({ where: { id } });

    if (!feature) {
      throw new BadRequestException('Feature not found');
    }

    await this.featuresRepository.remove(feature);
    return {
      status: 'success',
      message: 'Feature deleted successfully',
    };
  }

  async getFeatures(queryDto: QueryTeamDto) {
    const { version_system_id } = queryDto;

    const features = await this.featuresRepository
      .createQueryBuilder('features')
      .where('features.version_system_id = :version_system_id', { version_system_id })
      .getMany();

    return {
      status: 'success',
      message: 'Features retrieved successfully',
      data: features,
    };
  }

  async getOneFeature(id: string) {
    const feature = await this.featuresRepository.findOne({ where: { id } });

    if (!feature) {
      throw new BadRequestException('Feature not found');
    }

    return {
      status: 'success',
      message: 'Feature retrieved successfully',
      data: feature,
    };
  }
}
