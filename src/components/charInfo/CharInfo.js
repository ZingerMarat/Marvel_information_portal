import "./charInfo.scss";
import MarvelService from "../../services/MarvelService";
import { useEffect, useState } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

const CharInfo = ({ charId }) => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const marvelService = new MarvelService();

  const onCharLoaded = (newChar) => {
    setChar(newChar);
    setLoading(false);
  };

  const onCharLoading = () => {
    setLoading(true);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const updateChar = () => {
    if (!charId) {
      return;
    }

    onCharLoading();

    marvelService.getCharacter(charId).then(onCharLoaded).catch(onError);
  };

  useEffect(() => {
    updateChar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charId]);

  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !loading && !error && char ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  let imgStyle = { objectFit: "cover" };

  if (
    char.thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    imgStyle = { objectFit: "contain" };
  }

  return (
    <>
      <div className="char__basics">
        <img src={char.thumbnail} alt={char.name} style={imgStyle} />
        <div>
          <div className="char__info-name">{char.name}</div>
          <div className="char__btns">
            <a href={char.homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={char.wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{char.description}</div>
      {char.comics.length > 0 && (
        <>
          <div className="char__comics">Comics:</div>
          <ul className="char__comics-list">
            {char.comics.slice(0, 10).map((item, i) => (
              <li key={i} className="char__comics-item">
                {item.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default CharInfo;
