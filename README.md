# Epoch
A mobile game that allows users to track down satellites at various geographic landmarks to earn rewards.

# What it does
Epoch is a mobile game that allows users to track down the position of satellites at various geographic landmarks to earn rewards. Think geocaching, but the geocache is 400 km above you, travelling at 17000 mph, and it circles the Earth about 16 times a day. It is quite literally taking geocaching to new heights.

#How it works
Using the Urthecast API, we built our own API for our android client using mongodb, express, and node. Our android client calls our API which in turn calls Urthecast's API in order to obtain information about the position and time-stamps of satellites. The processing, such as distance calculations and point totals are handled on our server-side node app and sent back to the android client for display.

