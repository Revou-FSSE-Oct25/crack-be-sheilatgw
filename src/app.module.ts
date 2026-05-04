import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { PrismaService } from './prisma.service';
import { ProductModule } from './product/product.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrderItemController } from './order-item/order-item.controller';
import { OrderItemService } from './order-item/order-item.service';
import { OrderItemModule } from './order-item/order-item.module';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { CharacterController } from './character/character.controller';
import { CharacterModule } from './character/character.module';
import { SeriesModule } from './series/series.module';
import { ManufacturerController } from './manufacturer/manufacturer.controller';
import { ManufacturerService } from './manufacturer/manufacturer.service';
import { ManufacturerModule } from './manufacturer/manufacturer.module';

@Module({
  imports: [AuthModule, AdminModule, ProductModule, UserModule, CategoryModule, OrderModule, OrderItemModule, AddressModule, CartModule, CharacterModule, SeriesModule, ManufacturerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
