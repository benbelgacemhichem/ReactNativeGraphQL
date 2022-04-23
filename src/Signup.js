import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Pressable,
  View,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';

export default class SignUp extends Component {
  async register(values) {
    const axios = require('axios');
    await axios
      .post(
        'http://localhost:8002/graphql',
        {
          query: `mutation  {
          createUser(
            email: "${values.email}", 
            name: "${values.name}",
            password: "${values.password}"
          ) {
            email
            name
          }
        }`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        if (response.data.errors) {
          if (response.data.errors[0].message == 'Validation error') {
            Alert.alert('Error : Email alredy used');
          }
        } else {
          Alert.alert('User created successfully');
        }
      })
      .catch(error => {
        Alert.alert(`Error: ${error.message}`);
        console.log(`Error: ${error.message}`);
        console.error('There was an error!', error);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <View>
          <View style={styles.image}>
            <Image
              style={styles.logo}
              source={{uri: 'https://uwave.me/tendv2/app/icons/icon-72x72.png'}}
            />
          </View>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            onSubmit={values => this.register(values)}
            validationSchema={yup.object().shape({
              name: yup.string().required('Name is required.'),
              email: yup.string().email().required('Email is required.'),
              password: yup
                .string()
                .min(3, 'Password can not be less than 3 characters.')
                .max(11, 'Password can not be more than 12 characters long.')
                .required(),
            })}>
            {({
              values,
              errors,
              setFieldTouched,
              touched,
              handleChange,
              isValid,
              handleSubmit,
            }) => (
              <View style={styles.mainWrapper}>
                <TextInput
                  value={values.name}
                  style={styles.input}
                  onBlur={() => setFieldTouched('name')}
                  onChangeText={handleChange('name')}
                  placeholder="Name"
                />
                {touched.name && errors.name && (
                  <Text style={{fontSize: 11, color: 'red'}}>
                    {errors.name}
                  </Text>
                )}
                <TextInput
                  value={values.email}
                  style={styles.input}
                  onBlur={() => setFieldTouched('email')}
                  onChangeText={handleChange('email')}
                  placeholder="E-mail"
                />
                {touched.email && errors.email && (
                  <Text style={{fontSize: 11, color: 'red'}}>
                    {errors.email}
                  </Text>
                )}
                <TextInput
                  value={values.password}
                  style={styles.input}
                  placeholder="Password"
                  onBlur={() => setFieldTouched('password')}
                  onChangeText={handleChange('password')}
                  secureTextEntry={true}
                />
                {touched.password && errors.password && (
                  <Text style={{fontSize: 11, color: 'red'}}>
                    {errors.password}
                  </Text>
                )}

                <Pressable
                  style={styles.button}
                  disabled={!isValid}
                  onPress={handleSubmit}>
                  <Text style={styles.text}>Create</Text>
                </Pressable>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },

  mainWrapper: {
    padding: 40,
  },

  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 5,
    marginTop: 15,
    borderColor: '#cccccc',
    borderRadius: 4,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginTop: 25,
    backgroundColor: '#d17802',
  },

  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  logo: {
    width: 80,
    height: 80,
  },
  image: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
