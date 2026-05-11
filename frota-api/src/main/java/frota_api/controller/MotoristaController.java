package frota_api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import frota_api.domain.Motorista;
import frota_api.repository.MotoristaRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/motoristas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MotoristaController {

    @Autowired
    private MotoristaRepository repository;

    @GetMapping
    public List<Motorista> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Motorista criar(@RequestBody Motorista motorista) {
    return repository.save(motorista);
}

    @PutMapping("/{id}")
public Motorista atualizar(
        @PathVariable Long id,
        @RequestBody Motorista motoristaAtualizado
) {

    Motorista motorista = repository.findById(id)
            .orElseThrow();

    motorista.setNome(motorista.getNome());
    motorista.setCpf(motorista.getCpf());
    motorista.setCnh(motorista.getCnh());
    motorista.setCategoria(motorista.getCategoria());
    motorista.setStatus(motorista.getStatus());

    return repository.save(motorista);
}

@DeleteMapping("/{id}")
public void deletar(@PathVariable Long id) {

    repository.deleteById(id);
    }
}