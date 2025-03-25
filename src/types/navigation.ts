import { NavigatorScreenParams } from '@react-navigation/native';
import { Board, Location } from './index';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Login: undefined;
  SelectedLocations: { sourceLink: string };
  LinkResults: { sourceLink: string };
  LocationDetails: { location: Location };
  BoardDetails: { board: Board };
  NotFound: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  AllLocations: undefined;
  AllBoards: undefined;
  Profile: undefined;
}; 