package com.company.controller;

import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@RestController
@RequestMapping("/api/rpa")
public class RpaController {

    @GetMapping("/scrape")
    public String scrapeWebsite(@RequestParam String url) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("python3", "rpa_script.py", url);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            process.waitFor();

            return output.toString();
        } catch (Exception e) {
            return "{\"error\": \"Failed to execute script\"}";
        }
    }
}
