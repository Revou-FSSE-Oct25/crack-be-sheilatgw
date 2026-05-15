import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { CharacterModule } from './character/character.module';
import { SeriesModule } from './series/series.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [AuthModule, AdminModule, ProductModule, UserModule, CategoryModule, OrderModule, AddressModule, CartModule, CharacterModule, SeriesModule, ManufacturerModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
