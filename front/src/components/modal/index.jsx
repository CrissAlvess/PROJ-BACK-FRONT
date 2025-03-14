import React, { useEffect, useState } from "react";
import axios from 'axios';
import api from '../../services/api';
import './styles.css';

const ModalProfessoresDisciplinas = ({
    isOpen,
    onClose,
    professorSelecionado,
    reloadProfessores,  // Função para recarregar os dados dos professores após adição/edição
    reloadDisciplinas    // Função para recarregar as disciplinas
}) => {
    if (!isOpen) return null;

    // Estado para dados dos professores
    const [id, setId] = useState(professorSelecionado?.id ?? '');
    const [ni, setNi] = useState(professorSelecionado?.ni ?? '');
    const [nome, setNome] = useState(professorSelecionado?.nome ?? '');
    const [email, setEmail] = useState(professorSelecionado?.email ?? '');
    const [tel, setTel] = useState(professorSelecionado?.tel ?? '');
    const [ocupacao, setOcupacao] = useState(professorSelecionado?.ocupacao ?? '');

    // Estado para dados das disciplinas
    const [nomeDisciplina, setNomeDisciplina] = useState('');

    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const novoProfessor = { ni, nome, email, tel, ocupacao };

        if (professorSelecionado) {
            await atualizarProfessor({ ...professorSelecionado, ...novoProfessor });
        } else {
            await criarProfessor(novoProfessor);
        }
    };

    const criarProfessor = async (novoProfessor) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/professores', {
                ni: novoProfessor.ni,
                nome: novoProfessor.nome,
                email: novoProfessor.email,
                tel: novoProfessor.tel,
                ocupacao: novoProfessor.ocupacao
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            reloadProfessores();  // Atualiza a lista de professores
            onClose();
        } catch (error) {
            console.error("Erro ao criar professor:", error);
        }
    };

    const atualizarProfessor = async (professor) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/professor/${professor.id}`, {
                ni: professor.ni,
                nome: professor.nome,
                email: professor.email,
                tel: professor.tel,
                ocupacao: professor.ocupacao
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            reloadProfessores();  // Atualiza a lista de professores
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar professor:", error);
        }
    };

    const handleSubmitDisciplina = async (e) => {
        e.preventDefault();
        try {
            await api.post('disciplinas/', { nome: nomeDisciplina }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            reloadDisciplinas();  // Atualiza a lista de disciplinas
            onClose();
        } catch (error) {
            console.error("Erro ao adicionar disciplina:", error);
        }
    };

    return (
        <div className="modal-modal">
            <div className="container-modal">
                <div className="head-modal">
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <h2>{professorSelecionado ? "Editar Professor" : "Cadastrar Professor"}</h2>
                <div className="body-modal">
                    <form onSubmit={handleSubmit}>
                        <div className="caixa1">
                            <input
                                className="ni-modal"
                                value={ni}
                                placeholder="NI"
                                onChange={(e) => setNi(e.target.value)}
                            />
                            <input
                                className="nome-modal"
                                value={nome}
                                placeholder="Nome"
                                onChange={(e) => setNome(e.target.value)}
                            />
                            <input
                                className="email-modal"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className="tel-modal"
                                value={tel}
                                placeholder="Telefone"
                                onChange={(e) => setTel(e.target.value)}
                            />
                            <input
                                className="ocupacao-modal"
                                value={ocupacao}
                                placeholder="Ocupação"
                                onChange={(e) => setOcupacao(e.target.value)}
                            />
                        </div>
                        <div className="caixa2">
                            {/* Aqui você pode adicionar um campo para disciplinas se necessário */}
                            <input
                                className="disciplina-modal"
                                value={nomeDisciplina}
                                placeholder="Nome da Disciplina"
                                onChange={(e) => setNomeDisciplina(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                <div className="footer-modal">
                    <button type="submit" className="button-save" onClick={handleSubmit}>Salvar Professor</button>
                    <button type="submit" className="button-save" onClick={handleSubmitDisciplina}>Salvar Disciplina</button>
                </div>
            </div>
        </div>
    );
};

export default ModalProfessoresDisciplinas;
