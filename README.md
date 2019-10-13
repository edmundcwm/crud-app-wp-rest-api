# **A Simple CRUD app using the WordPress REST API**

### Description 
This is an example of utilizing the WP REST API to create an interactive application. Without logging into the wp-admin, you will be able to:
1. Create a post
2. Update a post
3. Delete a post
4. Display all posts

Since this is a front-end application, you would also need a WordPress installation to operate as the back-end/data-store. That is where all posts will be retrieved from.

Also, the plugin [**WP Basic Auth**](https://github.com/WP-API/Basic-Auth) is required to allow you to authenticate via the frontend and perform POST, PUT and DELETE requests. So make sure that is installed to your WP site.

### How to
1. Download the project files from this repo
2. Change the following variables in the **/assets/js/index.js** file
   * ``const url = ...`` in **line 2**. This should be the URL of your WP site.
   * ``window.btoa('admin:password')`` in **line 111, 155 and 206**. This should be the username and password of your WP site.
3. Install and activate the [**WP Basic Auth**](https://github.com/WP-API/Basic-Auth) plugin
4. Fire up **index.html** in your browser

Enjoy **REST**ing!

### Note
If you have issues with the creating, updating and deleting of posts, here are some possible solutions:
1. **Logout of your WP site** or open the App in an incognito window/different browser.
   This is an issue with the **WP Basic Auth** plugin. More [info](https://github.com/WP-API/WP-API/issues/2493#issuecomment-218716303).
2. Add the following to your **.htaccess** file, right below ``RewriteEngine On``
   ```
   RewriteCond %{HTTP:Authorization} ^(.*)
   RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
   ```
   More [info](https://github.com/WP-API/Basic-Auth/issues/35).

If you need help or want to report any bugs, please feel free to open up an issue!

_Last tested with WP v5.2.3_