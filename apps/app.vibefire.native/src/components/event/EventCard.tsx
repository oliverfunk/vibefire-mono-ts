import {
  Text,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from "react-native";

type EventCardProps = {
  event: {
    title: string;
    description: string;
    date: string;
    location: string;
  };
  onPress: (event: Event) => void;
};

const EventCard = ({ event, onPress }: EventCardProps) => {
  const { title, description, date, location } = event;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>
    </TouchableOpacity>
  );
};
