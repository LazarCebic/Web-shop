package com.webshop.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * Mapira fizicki folder na disku (gde LocalFileStorageService cuva slike)
 * na javno dostupnu putanju /images/**, tako da frontend moze direktno
 * da prikaze slike preko URL-a vracenog prilikom kreiranja proizvoda.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = new File(uploadDir).getAbsolutePath();
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + absolutePath + File.separator);
    }
}
