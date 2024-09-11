import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const marvelService = new MarvelService();

  const onCharListLoaded = (newCharList) => {
    setCharList(newCharList);
    setLoading(false);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  //componentDidMount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await marvelService.getAllCharacters();
        onCharListLoaded(data.data);
      } catch (error) {
        onError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <button className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default CharList;
