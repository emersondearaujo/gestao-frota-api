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

import frota_api.domain.Caminhao;
import frota_api.repository.CaminhaoRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/caminhoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CaminhaoController {

    @Autowired
    private CaminhaoRepository repository;

    @GetMapping
    public List<Caminhao> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Caminhao criar(@RequestBody Caminhao caminhao) {
        return repository.save(caminhao);
    }

    @PutMapping("/{id}")
    public Caminhao atualizar(
            @PathVariable Long id,
            @RequestBody Caminhao caminhaoAtualizado
    ) {

        Caminhao caminhao = repository.findById(id)
                .orElseThrow();

        caminhao.setPlaca(caminhaoAtualizado.getPlaca());
        caminhao.setModelo(caminhaoAtualizado.getModelo());
        caminhao.setCapacidadeKg(caminhaoAtualizado.getCapacidadeKg());
        caminhao.setTipo(caminhaoAtualizado.getTipo());
        caminhao.setStatus(caminhaoAtualizado.getStatus());

        return repository.save(caminhao);
    }

@DeleteMapping("/{id}")
public void deletar(@PathVariable Long id) {

    repository.deleteById(id);
    }
}