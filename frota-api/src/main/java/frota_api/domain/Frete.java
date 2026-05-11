package frota_api.domain;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Frete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Caminhao caminhao;

    @ManyToOne
    private Motorista motorista;

    @ManyToOne
    private Rota rota;

    private Double pesoCargaKg;

    private Double valorFrete;

    @Enumerated(EnumType.STRING)
    private Status status;
}