import { Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
export class UserHelper {
  static async generateDigistarID(
    joinDate: Date,
    usersRepository
  ): Promise<string> {
    const year = joinDate.getFullYear().toString().slice(-2);
    console.log('Tahun Digistar: ', year)

    const lastUser = await usersRepository.findOne({
      where: { unique_number: Like(`digistar-${year}%`) },
      order: { unique_number: 'DESC' }
    });

    let counter = 1;
    if (lastUser?.unique_number) {
      const lastCounter = parseInt(lastUser.unique_number.slice(-4), 10);
      counter = lastCounter + 1;
    }

    return `digistar-${year}${counter.toString().padStart(4, '0')}`;
  }
  static async generatePublicID(
    joinDate: Date,
    usersRepository
  ): Promise<string> {
    const year = joinDate.getFullYear().toString().slice(-2);
    console.log('Tahun Public: ', year)

    const lastUser = await usersRepository.findOne({
      where: { unique_number: Like(`public-${year}%`) },
      order: { unique_number: 'DESC' }
    });

    let counter = 1;
    if (lastUser?.unique_number) {
      const lastCounter = parseInt(lastUser.unique_number.slice(-4), 10);
      counter = lastCounter + 1;
    }

    return `public-${year}${counter.toString().padStart(4, '0')}`;
  }
}
