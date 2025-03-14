import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Header from "../../components/header";
import Footer from "../../components/footer";
import ModalProfessores from "../../components/modal";  // Importando o Modal
import axios from "axios";
import api from '../../services/api';
import './styles.css';

export default function Home() {
    const [dados, setDados] = useState([]);  // Para os professores
    const [disciplinas, setDisciplinas] = useState([]);  // Para as disciplinas
    const [modalOpen, setModalOpen] = useState(false);
    const [professorSelecionado, setProfessorSelecionado] = useState(null);
    const [seta, setSeta] = useState(false);
    const token = localStorage.getItem('token');

    // Fetch de dados
    useEffect(() => {
        // Fetch para professores
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/professores', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDados(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        // Fetch para disciplinas
        const fetchDisciplinas = async () => {
            const response = await api.get('disciplinas/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDisciplinas(response.data);
        };

        fetchData();
        fetchDisciplinas();
    }, [seta]);

    // Função para apagar professor
    const apagar = async (id) => {
        if (window.confirm("Tem certeza? ")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/professor/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDados(dados.filter((professor) => professor.id !== id));
                setSeta(!seta);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Função para criar professor
    const criar = async (novoProfessor) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/professores', {
                ni: novoProfessor.ni,
                nome: novoProfessor.nome,
                email: novoProfessor.email,
                tel: novoProfessor.tel,
                ocupacao: novoProfessor.ocupacao
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDados([...dados, response.data]);
            setModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    // Função para atualizar professor
    const atualizar = (professor) => {
        setProfessorSelecionado(professor);
        setModalOpen(true);
    };

    return (
        <div>
            <Header />
            <div className="container_home">
                {/* Lista de Professores */}
                <div className="lista">
                    <table>
                        <thead>
                            <tr className="icons">
                                <div className="col1"></div>
                                <div className="col2"></div>
                                <div className="col3"><th>ID</th></div>
                                <div className="col4"><th>NI</th></div>
                                <div className="col5"><th>NOME</th></div>
                                <div className="col6"><th>EMAIL</th></div>
                                <div className="col7"><th>TELEFONE</th></div>
                                <div className="col8"><th>OC</th></div>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.map((professor) => (
                                <tr key={professor.id} className="campos">
                                    <td className="icons">
                                        <div className="col1">
                                            <FaEdit className="edit" onClick={() => atualizar(professor)} />
                                        </div>
                                        <div className="col2">
                                            <FaTrash className="delete" onClick={() => apagar(professor.id)} />
                                        </div>
                                    </td>
                                    <div className="col3"><td>{professor.id}</td></div>
                                    <div className="col4"><td>{professor.ni}</td></div>
                                    <div className="col5"><td>{professor.nome}</td></div>
                                    <div className="col6"><td>{professor.email}</td></div>
                                    <div className="col7"><td>{professor.tel}</td></div>
                                    <div className="col8"><td>{professor.ocupacao}</td></div>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Barra de Pesquisa e Adicionar */}
                <div className="footer_table">
                    <div className="btn1">
                        <FaPlus className="adicionar" onClick={() => { setModalOpen(true); setProfessorSelecionado(null); }} />
                    </div>
                    <div className="id">
                        <input placeholder="id" />
                    </div>
                    <div className="nome">
                        <input placeholder="nome do professor" />
                    </div>
                    <div className="btn2">
                        <FaSearch className="procurar" />
                    </div>
                </div>

                {/* Modal de Professores */}
                <ModalProfessores
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    professorSelecionado={professorSelecionado}
                    criar={criar} // Passa a função criar para o modal
                />
            </div>
            <Footer />
        </div>
    );
}
