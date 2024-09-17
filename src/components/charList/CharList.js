import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharEnded(ended);
    setCharList((prevCharList) => [...prevCharList, ...newCharList]);
    setLoading(false);
    setNewItemsLoading(false);
    setOffset((prevOffset) => prevOffset + 9);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const fetchData = async (offset) => {
    try {
      const data = await marvelService.getAllCharacters(offset);
      onCharListLoaded(data.data);
    } catch (error) {
      onError(error);
    }
  };

  //componentDidMount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRequest = async (offset) => {
    onCharListLoading();
    fetchData(offset);
  };

  const onCharListLoading = () => {
    setNewItemsLoading(true);
  };

  const items = charList.map((item) => {
    let imgStyle = { objectFit: "cover" };
    if (
      item.thumbnail ===
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
    ) {
      imgStyle = { objectFit: "unset" };
    }

    return (
      <li
        key={item.id}
        className="char__item"
        onClick={() => onCharSelected(item.id)}
      >
        <img src={item.thumbnail} alt={item.name} style={imgStyle} />
        <div className="char__name">{item.name}</div>
      </li>
    );
  });

  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;

  return (
    <div className="char__list">
      {spinner}
      {errorMessage}
      <ul className="char__grid">{items}</ul>
      <button
        style={{ display: charEnded ? "none" : "block" }}
        className="button button__main button__long"
        disabled={newItemsLoading}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default CharList;
