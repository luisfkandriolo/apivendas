import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import EtherealMail from '@config/mail/EtherealMail';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const user = await usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email does not exists');

    const token = await userTokensRepository.generate(user.id);

    await EtherealMail.sendMail({
      to: email,
      body: `Token: ${token?.token}`,
    });
  }
}

export default SendForgotPasswordEmailService;
