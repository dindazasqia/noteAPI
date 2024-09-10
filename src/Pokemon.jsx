// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal } from 'react-bootstrap';
import './Pokemon.css'; 

function Pokemon() {
  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => {
        setPokemonData(response.data.results);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePokemonClick = (pokemon) => {
    axios.get(pokemon.url)
      .then(response => {
        const details = response.data;
        setSelectedPokemon({
          name: pokemon.name,
          power: details.stats[0].base_stat,
          damage: details.stats[1].base_stat,
          types: details.types.map(type => type.type.name),
          height: details.height,
          weight: details.weight,
          abilities: details.abilities.map(ability => ability.ability.name),
          moves: details.moves.slice(0, 5).map(move => move.move.name) 
        });
        setShowModal(true);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pokémon List</h1>
      <div className="container">
        <div className="row">
          {pokemonData.map((pokemon) => (
            <div className="col-md-4 pokemon-card" key={pokemon.name}>
              <Card style={{ width: '18rem' }}>
                <Card.Img 
                  variant="top" 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`} 
                />
                <Card.Body>
                  <Card.Title>{pokemon.name}</Card.Title>
                  <Button variant="primary" className="custom-btn-primary" onClick={() => handlePokemonClick(pokemon)}>View Details</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {selectedPokemon && (
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPokemon.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Power:</strong> {selectedPokemon.power}</p>
            <p><strong>Damage:</strong> {selectedPokemon.damage}</p>
            <p><strong>Types:</strong> {selectedPokemon.types.join(', ')}</p>
            <p><strong>Height:</strong> {selectedPokemon.height} decimetres</p>
            <p><strong>Weight:</strong> {selectedPokemon.weight} hectograms</p>
            <p><strong>Abilities:</strong> {selectedPokemon.abilities.join(', ')}</p>
            <p><strong>Moves:</strong> {selectedPokemon.moves.join(', ')}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="custom-btn-secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Pokemon;
