import * as React from "react";
import {
  Box,
  Divider,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useSearchMovies } from "./hooks/useSearchMovies";
import { Movie } from "./apis";
import { useDetectClickOutside } from "react-detect-click-outside";

export function App() {
  const { search, clearSearch, keyword, results, noResults } = useSearchMovies({
    maxResults: 10,
  });
  const [selected, setSelected] = React.useState<Movie>();
  const [showList, setShowList] = React.useState<boolean>(!!keyword);
  const [highlighted, setHighlighted] = React.useState<Movie | null>();

  const showResults = () => setShowList(true);
  const closeResults = () => setShowList(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapRef = useDetectClickOutside({ onTriggered: closeResults });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
  };

  const onFocus = () => {
    showResults();
  };

  const clearAll = () => {
    clearSearch();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onSelect = (movie: Movie) => {
    closeResults();
    setSelected(movie);
    clearAll();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (highlighted) {
        onSelect(highlighted);
        setHighlighted(null);
        inputRef.current && inputRef.current.blur();
      }
    }
  };

  const showSelectedMovie = () => {
    if (selected && !showList) {
      return (
        <Box>
          <h4>{selected.title}</h4>
        </Box>
      );
    }
  };

  const showNoResults = () => {
    if (noResults && showList) {
      return <Text m={3}>No Results Found</Text>;
    }
    return null;
  };

  const renderResults = () => {
    if (showList) {
      return (
        <List
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          minH={90}
          boxShadow="6px 5px 8px rgba(0,50,30,0.02)"
        >
          {results.map((item, i) => (
            <Box key={i}>
              <ListItem
                p={2}
                cursor="pointer"
                _hover={{ bg: "#bde4ff" }}
                onClick={() => onSelect(item)}
                onMouseEnter={() => setHighlighted(item)}
              >
                <Text fontSize={16}>
                  {item.title} (rank: {item.rank})
                </Text>
              </ListItem>
              {i < results.length - 1 ? <Divider /> : null}
            </Box>
          ))}
          {showNoResults()}
        </List>
      );
    }
    return null;
  };

  return (
    <Box style={{ padding: 30 }}>
      <Box ref={wrapRef}>
        <Input
          ref={inputRef}
          placeholder="Search"
          aria-label="search"
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        <Box mt={1}>
          {renderResults()}
          {showSelectedMovie()}
        </Box>
      </Box>
    </Box>
  );
}
