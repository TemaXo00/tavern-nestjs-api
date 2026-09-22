import {Type} from "@nestjs/common";

export interface MicroserviceBoostrapOptions<T> {
    name: string;
    module: Type<T>
    logs?: boolean;
    rmq?: boolean
}