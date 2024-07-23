import { Fragment, useEffect, useState } from "react";
import "./pokedex.css";
import { Dialog, Transition } from "@headlessui/react";
import http from "./utils/http";

export default function Pokedex() {
  let [isOpen, setIsOpen] = useState(false);

  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState({});

  useEffect(() => {
    getPokemons();
  }, []);

  const getPokemons = () => {
    http
      .get(`/pokemon`)
      .then((res) => {
        setPokemons(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectPokemon = async (pokemon) => {
    const detail = await http.get(pokemon.url);
    pokemon.name = detail.data.species.name;
    pokemon.height = detail.data.height;
    pokemon.weight = detail.data.weight;
    pokemon.hp = detail.data.stats.find(a => a.stat.name == 'hp').base_stat
    pokemon.attack = detail.data.stats.find(a => a.stat.name == 'attack').base_stat
    pokemon.defense = detail.data.stats.find(a => a.stat.name == 'defense').base_stat
    pokemon.speed = detail.data.stats.find(a => a.stat.name == 'speed').base_stat
    
    const description = await http.get(detail.data.species.url);
    pokemon.description = description.data.flavor_text_entries[0].flavor_text;

    setSelectedPokemon(pokemon);

    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="container mx-auto mt-10">
        <img
          className="w-52"
          src="https://raw.githubusercontent.com/sleduardo20/pokedex/0671af442dff1d8f7141e49eb83b438885bbc9e9/public/img/logo.svg"
        />
      </nav>

      <section className="container mx-auto mt-10 mb-20">
        <div className="grid grid-cols-4 gap-4">
          {pokemons.map((pokemon, index) => (
            <div
              className="shadow-md p-5 rounded-xl hover:shadow-xl hover:shadow-yellow-500 hover:border-yellow-500 hover:border-4 duration-500 flex flex-col"
              key={index}
            >
              <h1 className="text-2xl font-bold mt-2">
                {pokemon.name[0].toLocaleUpperCase() +
                  pokemon.name.slice(1, pokemon.name.length)}
              </h1>
              <h2 className="mb-4 text-xl text-gray-300">#{index + 1}</h2>
              <img
                src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
                className=" m-auto"
              />
              <button
                className="bg-gray-200 py-3 rounded-md font-bold hover:bg-yellow-400 duration-500 mt-4"
                onClick={() => selectPokemon(pokemon)}
              >
                Detail
              </button>
            </div>
          ))}
        </div>
      </section>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(!isOpen)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center backdrop-blur-md">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300 backdrop-blur-md"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200 backdrop-blur-md"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-row">
                    <img
                      src={`https://img.pokemondb.net/artwork/large/${selectedPokemon.name}.jpg`}
                      className="w-1/2 m-auto p-10"
                    />
                    <div>
                      <h1 className="text-2xl font-bold leading-6 text-gray-900">
                        {selectedPokemon.name}
                      </h1>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mt-8">
                          {selectedPokemon.description}
                        </p>
                        <div className="divide-y divide-dashed mt-8">
                          <div className="flex flex-row py-2">
                            <h4 className="font-bold">Height</h4>
                            <p className="ml-auto text-gray-400">{selectedPokemon.height}m</p>
                          </div>
                          <div className="flex flex-row py-2">
                            <h4 className="font-bold">Wight</h4>
                            <p className="ml-auto text-gray-400">{selectedPokemon.weight}kg</p>
                          </div>
                          <div className="flex flex-row py-2">
                            <h4 className="font-bold">HP</h4>
                            <p className="ml-auto text-gray-400">{selectedPokemon.hp}</p>
                          </div>
                          <div className="flex flex-row py-2">
                            <h4 className="font-bold">Attack</h4>
                            <p className="ml-auto text-gray-400">{selectedPokemon.attack}</p>
                          </div>
                          <div className="flex flex-row py-2">
                            <h4 className="font-bold">Defense</h4>
                            <p className="ml-auto text-gray-400">{selectedPokemon.defense}</p>
                          </div>
                          <div className="flex flex-row py-2">
                            <h4 className="font-bold">Speed</h4>
                            <p className="ml-auto text-gray-400">{selectedPokemon.speed}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
