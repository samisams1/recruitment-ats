import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallbackSecret';

export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(body: any) {
    const { email, password, firstName, lastName, role } = body;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists in system archives.');

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'CANDIDATE',
      },
    });

    return { id: newUser.id, email: newUser.email, role: newUser.role };
  }

  async loginUser(body: any) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid authentication credentials.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid authentication credentials.');

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
