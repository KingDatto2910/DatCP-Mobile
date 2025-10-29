import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { Card, Image, Icon } from "react-native-elements";
import { DISHES } from "../shared/dishes";
import { COMMENTS } from "../shared/comments";

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />
        <FlatList
          data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    );
  }
  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  }
}
class RenderDish extends Component {
  render() {
    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card>
          <Image
            source={require("./images/uthappizza.png")}
            style={{
              width: "100%",
              height: 100,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <Icon
            raised
            reverse
            type="font-awesome"
            color="#f50"
            name={this.props.favorite ? "heart" : "heart-o"}
            onPress={() =>
              this.props.favorite
                ? alert("Already favorite")
                : this.props.onPressFavorite()
            }
          />
        </Card>
      );
    }
    return <View />;
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES,
      comments: COMMENTS,
      favorites: [],
    };
  }
  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.state.dishes[dishId];
    const comments = this.state.comments.filter((cmt) => cmt.dishId === dishId);
    const favorite = this.state.favorites.some((el) => el === dishId);
    return (
      <ScrollView>
        <RenderDish
          dish={dish}
          favorite={favorite}
          onPressFavorite={() => this.markFavorite(dishId)}
        />
        <RenderComments comments={comments} />
      </ScrollView>
    );
  }
  markFavorite(dishId) {
    this.setState({ favorites: this.state.favorites.concat(dishId) });
  }
}
export default Dishdetail;
