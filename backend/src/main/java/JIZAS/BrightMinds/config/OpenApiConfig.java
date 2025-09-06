package JIZAS.BrightMinds.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BrightMinds API")
                        .description("A comprehensive REST API for managing educational content including questions, choices, answers, stories, scenes, users, and progress tracking.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("BrightMinds Team")
                                .email("support@brightminds.com")
                                .url("https://brightminds.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.brightminds.com")
                                .description("Production Server")
                ));
    }
}
