package JIZAS.BrightMinds.controller;

import JIZAS.BrightMinds.dto.ProgressRequestDTO;
import JIZAS.BrightMinds.dto.ProgressViewDTO;
import JIZAS.BrightMinds.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @PostMapping
    public ResponseEntity<ProgressViewDTO> createProgress(@RequestBody ProgressRequestDTO progressRequest) {
        try {
            ProgressViewDTO createdProgress = progressService.create(progressRequest);
            if (createdProgress != null) {
                return new ResponseEntity<>(createdProgress, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProgressViewDTO>> getAllProgress() {
        try {
            List<ProgressViewDTO> progressList = progressService.list();
            return new ResponseEntity<>(progressList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{progressId}")
    public ResponseEntity<ProgressViewDTO> getProgressById(@PathVariable Long progressId) {
        try {
            ProgressViewDTO progress = progressService.get(progressId);
            if (progress != null) {
                return new ResponseEntity<>(progress, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressViewDTO>> getProgressByUserId(@PathVariable Long userId) {
        try {
            List<ProgressViewDTO> progressList = progressService.getByUserId(userId);
            return new ResponseEntity<>(progressList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/story/{storyId}")
    public ResponseEntity<List<ProgressViewDTO>> getProgressByStoryId(@PathVariable Integer storyId) {
        try {
            List<ProgressViewDTO> progressList = progressService.getByStoryId(storyId);
            return new ResponseEntity<>(progressList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{progressId}")
    public ResponseEntity<ProgressViewDTO> updateProgress(@PathVariable Long progressId, @RequestBody ProgressRequestDTO progressRequest) {
        try {
            ProgressViewDTO updatedProgress = progressService.update(progressId, progressRequest);
            if (updatedProgress != null) {
                return new ResponseEntity<>(updatedProgress, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{progressId}")
    public ResponseEntity<Void> deleteProgress(@PathVariable Long progressId) {
        try {
            progressService.delete(progressId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
