import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Modal, // <-- Đã import
  StyleSheet, // <-- Đã import
  Button, // <-- Đã import
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { Card, Image, Icon, Rating, Input } from "react-native-elements"; // <-- Đã import
import { baseUrl } from "../shared/baseUrl";

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
        <Rating
          imageSize={12}
          readonly
          startingValue={item.rating}
          style={{ alignItems: "flex-start", paddingVertical: 5 }}
        />
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
            source={{ uri: baseUrl + dish.image }}
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
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
            <Icon
              raised
              reverse
              type="font-awesome"
              color="#f80"
              name="pencil"
              onPress={() => this.props.onPressComment()}
            />
          </View>
        </Card>
      );
    }
    return <View />;
  }
}
// redux
import { connect } from "react-redux";
// import { favorites } from "../redux/favorites"; // Dòng này không cần thiết
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};

import { postFavorite, postComment } from "../redux/ActionCreators";
const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
});
class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      author: "",
      comment: "",
      showModal: false,
    };
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resetForm() {
    this.setState({
      rating: 5,
      author: "",
      comment: "",
      showModal: false,
    });
  }

  handleComment(dishId) {
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );
    this.toggleModal();
  }

  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter(
      (cmt) => cmt.dishId === dishId
    );
    const favorite = this.props.favorites.some((el) => el === dishId);

    return (
      <React.Fragment>
        <ScrollView>
          <RenderDish
            dish={dish}
            favorite={favorite}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.toggleModal()}
          />
          <RenderComments comments={comments} />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              ratingCount={5}
              startingValue={this.state.rating}
              onFinishRating={(rating) => this.setState({ rating: rating })}
              style={{ paddingVertical: 10 }}
            />
            <Input
              placeholder="Author"
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              onChangeText={(value) => this.setState({ author: value })}
              value={this.state.author}
              containerStyle={styles.formInput}
            />
            <Input
              placeholder="Comment"
              leftIcon={{ type: "font-awesome", name: "comment-o" }}
              onChangeText={(value) => this.setState({ comment: value })}
              value={this.state.comment}
              containerStyle={styles.formInput}
            />
            <View style={styles.modalButton}>
              <Button
                onPress={() => this.handleComment(dishId)}
                color="#512DA8"
                title="Submit"
              />
            </View>
            <View style={styles.modalButton}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="gray"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </React.Fragment>
    );
  }
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 20,
    marginTop: 50,
  },
  formInput: {
    marginBottom: 10,
  },
  modalButton: {
    marginVertical: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
