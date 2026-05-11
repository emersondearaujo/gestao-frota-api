package frota_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import frota_api.domain.Rota;
import frota_api.repository.RotaRepository;

@RestController
@RequestMapping("/rotas")
@CrossOrigin("*")

public class RotaController {

    private final RotaRepository repository;

    public RotaController(RotaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Rota> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Rota criar(@RequestBody Rota rota) {
        return repository.save(rota);
    }
}