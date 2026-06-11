package com.comanda.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
            .info(new Info()
                .title("Comanda Digital API")
                .description("API REST para o sistema de gestão de restaurante Comanda Digital")
                .version("v1.0.0")
            )
            .externalDocs(new ExternalDocumentation()
                .description("Documentação do projeto")
                .url("https://github.com/your-repo/comanda-digital")
            );
    }
}
