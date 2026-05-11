import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081";

function App() {
  const [caminhoes, setCaminhoes] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editandoCaminhaoId, setEditandoCaminhaoId] = useState(null);
  const [editandoMotoristaId, setEditandoMotoristaId] = useState(null);
  const [fretes, setFretes] = useState([]);
  const [rotas, setRotas] = useState([]);

  const [novoFrete, setNovoFrete] = useState({
    caminhaoId: "",
    motoristaId: "",
    rotaId: "",
    pesoCargaKg: ""
  });


  const buscarFretes = async () => {
    const response = await axios.get("http://localhost:8081/fretes");
    setFretes(response.data);
  };

  const [novoCaminhao, setNovoCaminhao] = useState({
    placa: "",
    modelo: "",
    capacidadeKg: "",
    tipo: "",
    status: "DISPONIVEL"
  });

  const [novoMotorista, setNovoMotorista] = useState({
    nome: "",
    cpf: "",
    cnh: "",
    categoria: "",
    status: "DISPONIVEL"
  });

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [caminhaoResponse, motoristaResponse, freteResponse, rotaResponse] = await Promise.all([
        axios.get(`${API_BASE}/caminhoes`),
        axios.get(`${API_BASE}/motoristas`),
        axios.get(`${API_BASE}/fretes`),
        axios.get(`${API_BASE}/rotas`)
      ]);

      setCaminhoes(caminhaoResponse.data);
      setMotoristas(motoristaResponse.data);
      setFretes(freteResponse.data);
      setRotas(rotaResponse.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarFretes();
    carregarDados();
  }, [carregarDados]);



  const criarFrete = async () => {

    try {

      const payload = {
        caminhao: {
          id: Number(novoFrete.caminhaoId)
        },
        motorista: {
          id: Number(novoFrete.motoristaId)
        },
        rota: {
          id: Number(novoFrete.rotaId)
        },
        pesoCargaKg: Number(novoFrete.pesoCargaKg)
      };

      await axios.post(
        "http://localhost:8081/fretes",
        payload
      );

      await carregarDados();

      alert("Frete criado com sucesso!");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data ||
        "Erro ao criar frete"
      );
    }
  };

  const finalizarFrete = useCallback(async (id) => {

    try {

      await axios.patch(
        `${API_BASE}/fretes/${id}/finalizar`
      );

      await carregarDados();

    } catch (err) {

      console.error("Erro ao finalizar frete:", err);

      alert("Erro ao finalizar frete.");
    }

  }, [carregarDados]);

  const criarCaminhao = async () => {
    try {
      if (editandoCaminhaoId) {

        await axios.put(
          `${API_BASE}/caminhoes/${editandoCaminhaoId}`,
          novoCaminhao
        );

        alert("Caminhão atualizado com sucesso!");

        setEditandoCaminhaoId(null);

      } else {

        await axios.post(
          `${API_BASE}/caminhoes`,
          novoCaminhao
        );

        alert("Caminhão cadastrado com sucesso!");
      }

      setNovoCaminhao({
        placa: "",
        modelo: "",
        capacidadeKg: "",
        tipo: "",
        status: "DISPONIVEL"
      });

      await carregarDados();

    } catch (err) {

      console.error(err);

      alert("Erro ao salvar caminhão");
    }
  };

  const atualizarCaminhao = async () => {

    try {

      await axios.put(
        `${API_BASE}/caminhoes/${editandoCaminhaoId}`,
        novoCaminhao
      );

      setNovoCaminhao({
        placa: "",
        modelo: "",
        capacidadeKg: "",
        tipo: "",
        status: "DISPONIVEL"
      });

      setEditandoCaminhaoId(null);

      await carregarDados();

    } catch (err) {

      console.error(err);

      alert("Erro ao atualizar caminhão");
    }
  };

  const excluirCaminhao = async (id) => {

    const confirmar = confirm(
      "Deseja realmente excluir este caminhão?"
    );

    if (!confirmar) return;

    try {

      await axios.delete(
        `${API_BASE}/caminhoes/${id}`
      );

      carregarDados();

    } catch (err) {

      console.error(err);

      alert("Erro ao excluir caminhão");
    }
  };

  const criarMotorista = async () => {

    if (
      !novoMotorista.nome ||
      !novoMotorista.cpf ||
      !novoMotorista.cnh ||
      !novoMotorista.categoria
    ) {
      alert("Preencha todos os campos do motorista!");
      return;
    }

    try {

      if (editandoMotoristaId) {

        await axios.put(
          `${API_BASE}/motoristas/${editandoMotoristaId}`,
          novoMotorista
        );

        alert("Motorista atualizado com sucesso!");

        setEditandoMotoristaId(null);

      } else {

        await axios.post(
          `${API_BASE}/motoristas`,
          novoMotorista
        );

        alert("Motorista cadastrado com sucesso!");
      }

      setNovoMotorista({
        nome: "",
        cpf: "",
        cnh: "",
        categoria: "",
        status: "DISPONIVEL"
      });

      await carregarDados();

    } catch (err) {

      console.error(err);

      alert("Erro ao salvar motorista");
    }
  };


  const excluirMotorista = async (id) => {

    const confirmar = confirm("Deseja excluir este motorista?");

    if (!confirmar) return;

    try {

      await axios.delete(
        `${API_BASE}/motoristas/${id}`
      );

      await carregarDados();

    } catch (err) {

      console.error(err);

      alert("Erro ao excluir motorista");
    }
  };

  const corStatus = useMemo(() => ({
    DISPONIVEL: "#16a34a",
    EM_VIAGEM: "#ea580c",
    FINALIZADO: "#2563eb"
  }), []);

  const getStatusColor = (status) => corStatus[status] || "#444";

  // Todo o resto permanece igual...
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Carregando dados da frota...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>❌ Erro</h2>
        <p style={styles.errorText}>{error}</p>
        <button style={styles.retryButton} onClick={carregarDados}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>🚛 Sistema de Gestão de Frota</h1>
        <p style={styles.subtitulo}>Dashboard operacional de logística</p>
        <button style={styles.refreshButton} onClick={carregarDados}>
          🔄 Atualizar
        </button>
      </div>

      <div style={styles.dashboard}>
        <div style={styles.infoCard}>
          <h2 style={styles.infoNumber}>{caminhoes.length}</h2>
          <p>Caminhões</p>
        </div>
        <div style={styles.infoCard}>
          <h2 style={styles.infoNumber}>{motoristas.length}</h2>
          <p>Motoristas</p>
        </div>
        <div style={styles.infoCard}>
          <h2 style={styles.infoNumber}>{fretes.length}</h2>
          <p>Fretes</p>
        </div>
      </div>
      <div style={styles.formCard}>
        <div style={styles.formCard}>

          <h2 style={styles.cardTitle}>
            👨‍✈️ Cadastrar Motorista
          </h2>

          <div style={styles.formGrid}>

            <input
              style={styles.input}
              placeholder="Nome"
              value={novoMotorista.nome}
              onChange={(e) =>
                setNovoMotorista({
                  ...novoMotorista,
                  nome: e.target.value
                })
              }
            />

            <input
              style={styles.input}
              placeholder="CPF"
              value={novoMotorista.cpf}
              onChange={(e) =>
                setNovoMotorista({
                  ...novoMotorista,
                  cpf: e.target.value
                })
              }
            />

            <input
              style={styles.input}
              placeholder="CNH"
              value={novoMotorista.cnh}
              onChange={(e) =>
                setNovoMotorista({
                  ...novoMotorista,
                  cnh: e.target.value
                })
              }
            />

            <input
              style={styles.input}
              placeholder="Categoria"
              value={novoMotorista.categoria}
              onChange={(e) =>
                setNovoMotorista({
                  ...novoMotorista,
                  categoria: e.target.value
                })
              }
            />

          </div>

          <button
            style={styles.botaoCadastrar}
            onClick={criarMotorista}
          >
            👨‍✈️ Cadastrar Motorista
          </button>

        </div>

        <h2 style={styles.cardTitle}>
          ➕ Cadastrar Caminhão
        </h2>

        <div style={styles.formGrid}>

          <input
            style={styles.input}
            placeholder="Placa"
            value={novoCaminhao.placa}
            onChange={(e) =>
              setNovoCaminhao({
                ...novoCaminhao,
                placa: e.target.value
              })
            }
          />

          <input
            style={styles.input}
            placeholder="Modelo"
            value={novoCaminhao.modelo}
            onChange={(e) =>
              setNovoCaminhao({
                ...novoCaminhao,
                modelo: e.target.value
              })
            }
          />

          <input
            style={styles.input}
            placeholder="Capacidade KG"
            type="number"
            value={novoCaminhao.capacidadeKg}
            onChange={(e) =>
              setNovoCaminhao({
                ...novoCaminhao,
                capacidadeKg: e.target.value
              })
            }
          />

          <input
            style={styles.input}
            placeholder="Tipo"
            value={novoCaminhao.tipo}
            onChange={(e) =>
              setNovoCaminhao({
                ...novoCaminhao,
                tipo: e.target.value
              })
            }
          />

        </div>

        <button
          style={
            editandoCaminhaoId
              ? styles.botaoSalvar
              : styles.botaoCadastrar
          }
          onClick={
            editandoCaminhaoId
              ? atualizarCaminhao
              : criarCaminhao
          }
        >
          {
            editandoCaminhaoId
              ? "💾 Salvar Caminhão"
              : "🚛 Cadastrar Caminhão"
          }
        </button>

      </div>

      <div style={styles.formCard}>

        <h2 style={styles.cardTitle}>
          📦 Criar Frete
        </h2>

        <div style={styles.formGrid}>

          <select
            style={styles.input}
            value={novoFrete.rotaId}
            onChange={(e) =>
              setNovoFrete({
                ...novoFrete,
                rotaId: e.target.value
              })
            }
          >

            <option value="">
              Selecione a rota
            </option>

            {rotas.map((rota) => (

              <option
                key={rota.id}
                value={rota.id}
              >
                {rota.origem} - {rota.destino}
              </option>

            ))}

            <select
              style={styles.input}
              value={novoFrete.caminhaoId}
              onChange={(e) =>
                setNovoFrete({
                  ...novoFrete,
                  caminhaoId: e.target.value
                })
              }
            >

              <option value="">
                Selecione o caminhão
              </option>

              {caminhoes.map((c) => (

                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.modelo} - {c.placa}
                </option>

              ))}

            </select>

          </select>

          <select
            style={styles.input}
            value={novoFrete.motoristaId}
            onChange={(e) =>
              setNovoFrete({
                ...novoFrete,
                motoristaId: e.target.value
              })
            }
          >

            <option value="">
              Selecione o Motorista
            </option>

            {motoristas.map(m => (

              <option
                key={m.id}
                value={m.id}
              >
                {m.nome}
              </option>

            ))}

          </select>

          <input
            style={styles.input}
            type="number"
            placeholder="Peso da carga KG"
            value={novoFrete.pesoCargaKg}
            onChange={(e) =>
              setNovoFrete({
                ...novoFrete,
                pesoCargaKg: e.target.value
              })
            }
          />

        </div>

        <button
          style={styles.botaoCadastrar}
          onClick={criarFrete}
        >
          📦 Criar Frete
        </button>

      </div>

      <div style={styles.grid}>
        <Card
          title="🚚 Caminhões"
          data={caminhoes}
          corStatus={getStatusColor}
          setNovoCaminhao={setNovoCaminhao}
          setEditandoCaminhaoId={setEditandoCaminhaoId}
          excluirCaminhao={excluirCaminhao}
        />
        <Card
          title="👨‍✈️ Motoristas"
          data={motoristas}
          corStatus={getStatusColor}
          excluirMotorista={excluirMotorista}
          setNovoMotorista={setNovoMotorista}
          setEditandoMotoristaId={setEditandoMotoristaId}
        />
        <FreteCard
          title="📦 Fretes"
          data={fretes}
          corStatus={getStatusColor}
          onFinalizarFrete={finalizarFrete}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  data,
  corStatus,
  setNovoCaminhao,
  setEditandoCaminhaoId,
  excluirCaminhao,
  excluirMotorista,
  setNovoMotorista,
  setEditandoMotoristaId,
}) {

  return (

    <div style={styles.card}>

      <h2 style={styles.cardTitle}>
        {title}
      </h2>

      {
        data.length === 0 ? (

          <div style={styles.emptyState}>
            <p>Nenhum item encontrado</p>
          </div>

        ) : (

          data.map(item => (

            <div
              key={item.id}
              style={{
                ...styles.item,
                borderLeft: `8px solid ${corStatus(item.status)}`
              }}
            >

              <div>

                <strong>
                  {item.modelo || item.nome}
                </strong>

                {item.placa && setNovoCaminhao && setEditandoCaminhaoId && (
                  <p>🚛 Placa: {item.placa}</p>
                )}
                {
                  item.cpf && (

                    <div style={styles.actions}>

                      <button
                        style={styles.editButton}
                        onClick={() => {

                          setNovoMotorista({
                            nome: item.nome,
                            cpf: item.cpf,
                            cnh: item.cnh,
                            categoria: item.categoria,
                            status: item.status
                          });

                          setEditandoMotoristaId(item.id);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() => excluirMotorista(item.id)}
                      >
                        🗑️
                      </button>

                    </div>
                  )
                }

                {item.capacidadeKg && (
                  <p>
                    ⚖️ Capacidade: {item.capacidadeKg} KG
                  </p>
                )}

                {item.cpf && (
                  <p>💳 CPF: {item.cpf}</p>
                )}

                {item.cnh && (
                  <p>🚗 CNH: {item.cnh}</p>
                )}

                {item.categoria && (
                  <p>⭐ Categoria: {item.categoria}</p>
                )}

                {item.tipo && (
                  <p>📦 Tipo: {item.tipo}</p>
                )}

              </div>

              <div>

                <span
                  style={{
                    ...styles.status,
                    backgroundColor: corStatus(item.status)
                  }}
                >
                  {item.status}
                </span>

                {
                  item.placa && (

                    <div style={styles.actions}>

                      <button
                        style={styles.editButton}
                        onClick={() => {

                          setNovoCaminhao({
                            placa: item.placa,
                            modelo: item.modelo,
                            capacidadeKg: item.capacidadeKg,
                            tipo: item.tipo,
                            status: item.status
                          });

                          setEditandoCaminhaoId(item.id);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() => excluirCaminhao(item.id)}
                      >
                        🗑️
                      </button>

                    </div>
                  )
                }

              </div>

            </div>

          ))
        )
      }

    </div>
  );
}

function FreteCard({ title, data, corStatus, onFinalizarFrete }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>{title}</h2>
      {data.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nenhum frete encontrado</p>
        </div>
      ) : (
        data.map(frete => (
          <div key={frete.id} style={{ ...styles.item, borderLeft: `8px solid ${corStatus(frete.status)}` }}>
            <div>
              <strong>{frete.rota?.origem} → {frete.rota?.destino}</strong>
              <p>💰 Valor: R$ {frete.valorFrete?.toLocaleString('pt-BR')}</p>
              <p>⚖️ Peso: {frete.pesoCargaKg} KG</p>
              <p>🚚 Caminhão: {frete.caminhao?.modelo || 'N/A'}</p>
              <p>👨‍✈️ Motorista: {frete.motorista?.nome || 'N/A'}</p>
            </div>
            <div style={styles.freteActions}>
              <span style={{ ...styles.status, backgroundColor: corStatus(frete.status) }}>
                {frete.status}
              </span>
              {frete.status === "EM_VIAGEM" && (
                <button style={styles.botao} onClick={() => onFinalizarFrete(frete.id)}>
                  ✅ Finalizar
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {

  formCard: {
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    padding: "25px",
    borderRadius: "20px",
    marginBottom: "30px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginBottom: "20px"
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #475569",
    background: "#0f172a",
    color: "white",
    fontSize: "14px"
  },

  botaoCadastrar: {
    background: "linear-gradient(45deg, #16a34a, #15803d)",
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  },

  botaoSalvar: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  },

  container: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "40px",
    fontFamily: "Arial"
  },

  header: {
    marginBottom: "30px"
  },

  titulo: {
    color: "white",
    fontSize: "40px",
    marginBottom: "10px"
  },

  subtitulo: {
    color: "#cbd5e1"
  },

  dashboard: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  infoCard: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  },

  cardTitle: {
    color: "white",
    marginBottom: "20px"
  },

  item: {
    background: "#334155",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "15px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  status: {
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
    marginBottom: "10px"
  },

  botao: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },
  editButton: {
    background: "#f59e0b",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer"
  },

  deleteButton: {
    background: "#dc2626",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer"
  },

};

// StyleSheet para spinner...
const styleSheet = document.createElement("style");
styleSheet.textContent = `@keyframes spin {0 % { transform: rotate(0deg); } 100% {transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default App;