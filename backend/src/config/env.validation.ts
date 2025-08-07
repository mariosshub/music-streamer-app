import { plainToInstance } from "class-transformer";
import { IsString, validateSync } from "class-validator";

class EnvironmentalVariables {
    @IsString()
    DB_NAME: string;

    @IsString()
    CONNECTION_URL: string;

    @IsString()
    JWT_SECRET: string;

    @IsString()
    BASE_URL: string;

    @IsString()
    NODE_ENV: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentalVariables, config, {
        /*
        will tell class-transformer that if it sees a
        primitive that is currently a string (like a boolean or a number) to assume it
        should be the primitive type instead and transform it, even though @Type(() =>
        Number) or @Type(() => Boolean) isn't used
         */
        enableImplicitConversion: true
    });

    /**
     * Performs sync validation of the given object.
     * Note that this method completely ignores async validations.
     * If you want to properly perform validation you need to call validate method
     instead.
    */
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig
}