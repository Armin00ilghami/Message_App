import { CameraRoll, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Permissions } from 'expo';
import PropTypes from 'prop-types';
import React from 'react';

import Grid from './Grid';


const keyExtractor = ({ uri }) => uri;

export default class ImageGrid extends React.Component {
    loading = false;
    cursor = null;

    static propTypes = {
        onPressImage: PropTypes.func,
    };
      
    static defaultProps = {
        onPressImage: () => {},
    };

    state = {
        images: [
            { uri: 'https://iransite.com/Portals/iransite/EasyDNNNews/8276/images/img-Untitled-2-220-220-p-C-97.jpg' },
            { uri: 'https://infography.me/wp-content/uploads/2024/03/IMG_20240304_201830_293.jpg' },
            { uri: 'https://infography.me/wp-content/uploads/2021/08/15.jpeg' },
            { uri: 'http://www.photographyofiran.com/MediaServer/gf8PZV0l3e87U8gzlho7Z3/1091_0_2016_12_280_200_0_jpg/%D8%A7%D8%B1%DA%A9-%D8%B9%D9%84%DB%8C%D8%B4%D8%A7%D9%87-%D8%AA%D8%A8%D8%B1%DB%8C%D8%B2.jpg' },
        ],
    };

    renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
        const { onPressImage } = this.props;

        const style = {
            width: size,
            height: size,
            marginLeft,
            marginTop,
        };

        return (
            <TouchableOpacity
                key={uri}
                activeOpacity={0.75}
                onPress={() => onPressImage(uri)}
                style={style}
            >
                <Image source={{ uri }} style={styles.image} />
            </TouchableOpacity>

        );
    };


    componentDidMount() {
        this.getImages();
    }

    getImages = async (after) => {
        if (this.loading) return;

        this.loading = true;

        const results = await CameraRoll.getPhotos({
            first: 20,
            after,
        });

        const { edges, page_info: { has_next_page, end_cursor } } = results;

        const loadedImages = edges.map(item => item.node.image);

        this.setState(
            {
                images: this.state.images.concat(loadedImages),
            },
            () => {
                this.loading = false;
                this.cursor = has_next_page ? end_cursor : null;
            },
        );
    };

    getNextImages = () => {
        if (!this.cursor) return;
        this.getImages(this.cursor);
    };
        
            

    render() {
        const { images } = this.state;

        return (
            <Grid
                data={images}
                renderItem={this.renderItem}
                keyExtractor={keyExtractor}
                onEndReached={this.getNextImages}
            />
        );
    }
     
}


const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
}); 