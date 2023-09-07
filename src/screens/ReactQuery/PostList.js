import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchPosts, createPost, updatePost, deletePost } from './api';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PostsList = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery('posts', fetchPosts);

  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const updatePostMutation = useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const deletePostMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const handleCreatePost = async () => {
    const newPostData = {
      title: 'New Post Title',
      body: 'New Post Body',
      userId: 1,
    };
    await createPostMutation.mutateAsync(newPostData);
  };

  const handleUpdatePost = async (postId) => {
    const updatedPostData = {
      title: 'Updated Post Title',
      body: 'Updated Post Body',
    };
    await updatePostMutation.mutateAsync({ postId, updatedPostData });
  };

  const handleDeletePost = async (postId) => {
    await deletePostMutation.mutateAsync(postId);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View>
      <Text>Posts List:</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{width:240}} >{item.id}. {item.title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleUpdatePost(item.id)} style={{ padding: 5, backgroundColor: 'green', marginRight: 10 }}>
                <Text style={{ color: 'white' }}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePost(item.id)} style={{ padding: 5, backgroundColor: 'red' }}>
                <Text style={{ color: 'white' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Create Post" onPress={handleCreatePost} />
    </View>
  );
};

export default PostsList;
