# PubSub Clients/Servers

## Basics

A Topic is a queue a Message is passed into. When you publish a Message, it is to a Topic.

A Subscription is a queue a Message is pulled out of. When a Message arrives on a Topic, it is added to every Subscription on that Topic (usually, some Subscriptions can be set up in such a way that they receive only certain Messages).

A Subscriber (Like the one created by a PubSub server), attaches itself to a Subscription. Messages in a Subscription will be provided to a single Subscriber at a time. If the message is Acknowledged by the Subscriber, it will not be provided to another Subscriber. If the Subscriber fails to acknowledge the Message, it will return to available in the Subscription to be handled by another Subscriber.

Message acknowledgement is done automatically by the PubSub Client in our case.

## Server

A Server needs a Topic and a Subscription to that topic, on which it will listen. 

## Client

A Client needs a Topic on which it will send requests

## Request-Response

Google Cloud PubSub is not well suited to the request-response model, only fire-and-forget messages are supported.

## Config 

### Server

On the server side, you need the following config to receive PubSub events:

| variable                        | required      | description                                                                                                                                                                                      |
|---------------------------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| PUBSUB_PROJECT                  | yes           | The name of the GCP project to access for PubSub                                                                                                                                                 |
| PUBSUB_EMULATOR_HOST            | only in local | The host where a pubsub emulator is running                                                                                                                                                      |
| PUBSUB_TOPIC                    | yes           | The topic name on which the subscription has been created                                                                                                                                        |
| PUBSUB_SUBSCRIPTION             | yes           | The subscription name to listen for messages on                                                                                                                                                  |
| PUBSUB_ADDITIONAL_SUBSCRIPTIONS | no            | Additional topic/subscription pairs in the format: `topic1:subscription1;topic2:subscription2`. That is, each pair separated by semicolon (`;`), topic and subscription separated by colon (`:`) |