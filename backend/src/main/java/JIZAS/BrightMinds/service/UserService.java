package JIZAS.BrightMinds.service;

import JIZAS.BrightMinds.dto.UserRequestDTO;
import JIZAS.BrightMinds.dto.UserViewDTO;
import JIZAS.BrightMinds.entity.User;
import JIZAS.BrightMinds.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) { this.repo = repo; }

    public UserViewDTO create(UserRequestDTO req) {
        User u = new User();
        u.setFName(req.getFName());
        u.setLName(req.getLName());
        u.setUsername(req.getUsername());
        u.setPassword(req.getPassword());
        return toView(repo.save(u));
    }

    public UserViewDTO get(Long id) {
        return repo.findById(id).map(this::toView).orElse(null);
    }

    public List<UserViewDTO> list() {
        return repo.findAll().stream().map(this::toView).collect(Collectors.toList());
    }

    public UserViewDTO update(Long id, UserRequestDTO req) {
        User u = repo.findById(id).orElse(null);
        if (u == null) return null;
        u.setFName(req.getFName());
        u.setLName(req.getLName());
        u.setUsername(req.getUsername());
        u.setPassword(req.getPassword());
        return toView(repo.save(u));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    private UserViewDTO toView(User u) {
        UserViewDTO v = new UserViewDTO();
        v.setUserId(u.getUserId());
        v.setFName(u.getFName());
        v.setLName(u.getLName());
        v.setUsername(u.getUsername());
        return v;
    }
}
