import { IsNotEmpty } from "class-validator";

export class CreateAddressDto {
  @IsNotEmpty()
  public streetName: string;

  public streetCode: string;

  @IsNotEmpty()
  public city: string;

  @IsNotEmpty()
  public postalCode: string;

  @IsNotEmpty()
  public countryCOde: string;
}
