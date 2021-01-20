import { Component, OnInit } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
const subject = webSocket("ws://localhost:8085/mydlq");

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {
  stompClient = null;
  SOCKET_ENDPOINT = "/mydlq";
  SUBSCRIBE_PREFIX = "/topic"
  SUBSCRIBE = "";
  SEND_ENDPOINT = "/app/test";

  constructor() { }

  ngOnInit(): void {
    subject.subscribe(next => {
      console.log('message received: ' + next)
    })
  }

}
