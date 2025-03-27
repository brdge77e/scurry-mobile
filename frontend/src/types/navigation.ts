import { NavigatorScreenParams } from '@react-navigation/native';
import { Board, Location } from './index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  LinkResults: {
    sourceLink: string;
  };
  SelectedLocations: {
    sourceLink: string;
  };
  LocationDetails: {
    locationId: string;
  };
  BoardDetails: {
    boardId: string;
  };
  AllBoards: undefined;
  Board: {
    boardId: string;
  };
  NotFound: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  AllLocations: undefined;
  AllBoards: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = NativeStackNavigationProp<MainTabParamList>; 