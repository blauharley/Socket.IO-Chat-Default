<h2>ChatRoomManager</h2>
<p>
  It's both a NodeJS and JavaScript Class that can manage chat rooms. This package requires <a href="http://socket.io/">Socket.IO</a> to work properly.
  <i>RoomHashes</i> are used to handle chat rooms and clients. This package enables users to pass/generate/handle <i>RoomHashes</i> respectively chat rooms in a way that fulfils their project requirements best.
</p>

<h3>Constructor</h3>

<h2>Server-Constructor</h2>

<p>This class is considered to be used on NodeJS server side.</p>

<blockquote>

  <p><b>constructor ChatRoomManagerServer( in opts:Object ) : instance</b></p>
  <p>
	@param <b><i>opts</i></b> must be an Object to be given to adjust some Preferences:
	<ul>
         <li><b><i>io</i></b> must be an Socket.IO <i>Object</i></li>
	 <li><i>maxGuests</i> must be an number to determine how many guests are allowed to enter a certain room. when omitted a default value of 5 is used.</li>
	</ul>
  </p>

  <p>@return instance</p>
	
</blockquote>

<h2>Client-Constructor</h2>

<p>This class is considered to be used on your browser's client side.</p>

<blockquote>

  <p><b>constructor ChatRoomManagerClient( in opts:Object ) : instance</b></p>
  <p>
	@param <b><i>opts</i></b> must be an Object to be given to adjust some Preferences:
	<ul>
         <li><b><i>localhost</i></b> must be an string(URL) that references to a server instance of ChatRoomManagerServer that runs on socket.io.</li>
	 <li><i>roomHash</i> must be an string so that a client can be attributed to a certain room. This option can be omitted but <i>hashHandler</i> must be passed instead to generate a <i>roomHash</i>.</li>
         <li><i>hashHandler</i> must be a <i>Function</i> that is used to generate a <i>roomHash</i>. Within this <i>Function</i> it is left to a programmer to implement logic that fulfils their project requirements of how to gain a certain <i>roomHash</i> but keep in mind that the passed <i>Function</i> has to <b>return</b> a currently generated <i>roomHash</i></li>
         <li><i>roomArea</i> must be an string that references to a DOM element that can be used within the method <i>updateRoomArea</i>.</li>
         <li><i>msgArea</i> must be an string that references to a DOM element that can be used within the method <i>receive</i> and <i>updateHistory</i>.</li>
	</ul>
  </p>

  <p>@return instance</p>
	
</blockquote>

<h3>Public Methods</h3>

<p>Receive messages that are being sent by other clients within same room.<p>

<blockquote>

  <p><b>ChatRoomManagerClient.prototype.receive( in message:[Object||String], in msgArea:DOMElement ) : undefined</b></p>
  <p>
     <p>@param <b><i>message</i></b> can be an <i>Object</i> or <i>String</i> that contains a message being written by another client.</p>
     <p>@param <b><i>msgArea</i></b> is a <i>DOMElement</i> that can be updated by ordinary DOM query methods. When no <i>msgArea</i> options is passed into the constructor parameter <i>msgArea</i> remains <i>undefined</i>.</p>
  </p>

  <p>@return undefined</p>

</blockquote>

<p>Update DOM elements when there is an update concerning new rooms/clients or closing rooms.<p>

<blockquote>

  <p><b>ChatRoomManagerClient.prototype.updateRoomArea( in data:Array, in roomArea:DOMElement ) : undefined</b></p>
  <p>
     <p>@param <b><i>data</i></b> is an <i>Array</i> that contains all available rooms. Each room is an <i>Object</i> that has a <i>hash</i> and <i>num</i> property.</p>
     <p>@param <b><i>roomArea</i></b> is a <i>DOMElement</i> that can be updated by ordinary DOM query methods. When no <i>roomArea</i> options is passed into the constructor parameter <i>roomArea</i> remains <i>undefined</i>.</p>
  </p>

  <p>@return undefined</p>

</blockquote>

<p>Update DOM elements by written messages since room exists. This methods is only called at the beginning when currently connected.<p>

<blockquote>

  <p><b>ChatRoomManagerClient.prototype.updateHistory( in history:Array, in msgArea:DOMElement ) : undefined</b></p>
  <p>
     <p>@param <b><i>history</i></b> is an <i>Array</i> that contains all written messages since room exists.</p>
     <p>@param <b><i>roomArea</i></b> is a <i>DOMElement</i> that can be updated by ordinary DOM query methods. When no <i>msgArea</i> options is passed into the constructor parameter <i>msgArea</i> remains <i>undefined</i>.</p>
  </p>

  <p>@return undefined</p>

</blockquote>

<p>When you want to declare URL's with a certain <i>roomHash</i> that clients can browse to for instance. This method is called as soon as <i>roomHash</i> is verified and valid.<p>

<blockquote>

  <p><b>ChatRoomManagerClient.prototype.validHash( in hash:String ) : undefined</b></p>
  <p>
     <p>@param <b><i>hash</i></b> is an <i>String</i> that is verified and valid.</p>
  </p>

  <p>@return undefined</p>

</blockquote>

<h3>Supported Browsers:</h3>

<ul>
  <li>IE 9+</li>
  <li>Mozilla Firefox</li>
  <li>Google Chrome</li>
  <li>Apple Safari</li>
  <li>Opera</li>
</ul>

<h3>License:</h3>
GNU: Basically this software can be used and modified freely and without any restrictions.