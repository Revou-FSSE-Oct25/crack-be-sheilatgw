import { ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService){}

    async login(login: LoginDto) {
        const { identifier, password } = login;

        const isEmail = identifier.includes('@');
        
        if (isEmail) {
            const user = await this.prisma.user.findUnique({ where: { email: identifier }, });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                throw new UnauthorizedException('Invalid email/username or password',);
            }

            return {
                access_token: await this.jwtService.signAsync({
                sub: user.user_id,
                email: user.email,
                role: 'customer',
            }),
                role: 'customer',
            };
        }

            const admin = await this.prisma.admin.findUnique({ where: { email: identifier }, });

        if (admin) {
            const match = await bcrypt.compare(password, admin.password);

            if (!match) {
                throw new UnauthorizedException('Invalid email/username or password',);
            }

            return {
                    access_token: await this.jwtService.signAsync({
                    sub: admin.admin_id,
                    email: admin.email,
                    role: 'admin',
                }),
                    role: 'admin',
                };
            }
        }

        else {
            const user = await this.prisma.user.findUnique({ where: { username: identifier }, });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

        if (!match) {
        throw new UnauthorizedException( 'Invalid email/username or password',);
        }

        return {
            access_token: await this.jwtService.signAsync({
                sub: user.user_id,
                email: user.email,
                role: 'customer',
            }),
            role: 'customer',
            };
        }
    }

        throw new UnauthorizedException('Invalid email/username or password',);
    }

    async register(register: RegisterDto){
        const { email, username, fullName, password, birthDate } = register;

        const emailExist = await this.prisma.user.findUnique({where: {email},});

        if (emailExist){
            throw new ConflictException("Email already in use")
        }

        const usernameExist = await this.prisma.user.findUnique({ where: {username},});

        if (usernameExist){
            throw new ConflictException("Username is already taken")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.prisma.user.create({
            data: {
                email,
                username,
                fullName,
                password: hashedPassword,
                birthDate: new Date(birthDate),
            }
        })

        return {
            message: "Registration Successful",
            userId: user.user_id,
        };
    }
}
