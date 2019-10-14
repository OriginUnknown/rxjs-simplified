import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import testModule from './test';

console.log('RxJS Boiler Running...');
console.log(`testModule`, testModule());


const fetchAllPosts = async (endpoint) => {
    let callAPI = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`);
    let response = await callAPI.json();
    return response;
};

const getPosts = async (endpoint) => await fetchAllPosts(endpoint);

// Basic pub/sub: the subject here is the observable; for any subscribed observer, it'll emit
// the results returned from the api via the observer.next() method in order to notify any
// subscribers listening
const getPosts$ = (endpoint) => Observable.create(async observer => {
    try {
        let response = await fetchAllPosts(endpoint);
        observer.next(response);
        observer.complete();
    } catch (error) {
        observer.error('API call failed', error);
    }
});

let data = [
    {id: 1, name: 'Fred Smith', age: 21},
    {id: 2, name: 'Jayne Ayre', age: 19},
    {id: 3, name: 'Paul Timmons', age: 32},
];

let promiseData = async () => await Promise.resolve(data);

let promiseObservable = async(promise) => {
    let result = []; // optional
    // 1. Get the data from the promise
    let asyncData = await promise();
    // 2. wrap the promise data in an Obsevable, then perform the required
    // operations needed to manipulate the data
    let resultObservable$ = from(asyncData).pipe(
        map( values => ({...values, department: 'Human Resources'}) )
    );
    resultObservable$.subscribe(val => {
        result.push(val);
    });
    return result;
}

// call an anonymous IIFE to log the async data from promiseObservable
(
    async() => console.log('results from normal promise', await promiseObservable(promiseData))
)();




// const result = getPosts('posts');
// console.log an async/await value via an IIFE

// (async() => console.log('results from normal promise', await result))();

// Basic observable pub/sub pattern con't -> the subsrcibed observer accesses the data emitted from
// the observable and processes it accordingly. In this case, we're just console.logging the value

// getPosts$('posts').subscribe(posts => console.log(`Posts from the observable`, posts));

// using pipes to chain operators

// const getIds$ = from(getPosts('posts')).pipe(
//     map(postArrayResponse => postArrayResponse.map(({ id }) => id))
// );


// const filterUserIdsWithOnes = post => {
//     console.log(`from filterUserIdsWithOnes`, post.userId);
//     return post.userId === 1;
// }

// const getUserIdsWithOnes = postArrayResponse => filterUserIdsWithOnes(postArrayResponse) 
// const getUserIdsWithOnes = postArrayResponse => postArrayResponse.filter(filterUserIdsWithOnes)

// const getAllUserIdsWithOnes$ = from(getPosts('posts')).pipe(
//     filter(posts => console.log(`poop`, posts))
// );

// getAllUserIdsWithOnes$.subscribe(
//     postsWithOnes => console.log(`Filtered on all posts with a user id of one`, postsWithOnes)
// )

// getIds$.subscribe(ids => console.log(`the ids from the posts are`, ids));