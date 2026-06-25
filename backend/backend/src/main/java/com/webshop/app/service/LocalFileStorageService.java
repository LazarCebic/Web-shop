package com.webshop.app.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Lokalno cuvanje slika proizvoda na disku servera, kao zamena za AWS S3.
 * Slike se cuvaju u folder "uploads/" u korenu projekta i serviraju se
 * preko statickog resurs handlera definisanog u WebConfig (putanja /images/**).
 */
@Service
@Slf4j
public class LocalFileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:2424}")
    private String baseUrl;

    public String saveImageToS3(MultipartFile photo) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(
                    photo.getOriginalFilename() != null ? photo.getOriginalFilename() : "image"
            );
            String extension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalFilename.substring(dotIndex);
            }

            // jedinstveno ime fajla da se ne preklapaju slike sa istim originalnim nazivom
            String newFileName = UUID.randomUUID() + extension;
            Path targetPath = uploadPath.resolve(newFileName);

            Files.copy(photo.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return baseUrl + "/images/" + newFileName;

        } catch (IOException e) {
            log.error("Unable to save image locally", e);
            throw new RuntimeException("Unable to save image: " + e.getMessage());
        }
    }
}
