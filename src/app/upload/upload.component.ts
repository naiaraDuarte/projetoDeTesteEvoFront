import { environment } from './../../environments/environment';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  @Input() urlImagem: string;
  imagemSelecionada: File = null;
  progress: number;
  message: string;

  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log(this.urlImagem);
  }

  carregarImagem(file: FileList) {
    this.imagemSelecionada = file.item(0);

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.urlImagem = event.target.result;
    };
    reader.readAsDataURL(this.imagemSelecionada);
  }

  public uploadImagem = (files) => {
    console.log(this.urlImagem);
    this.carregarImagem(files);
    if (files.length === 0) {
      return;
    }
    let ImagemParaUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', ImagemParaUpload, ImagemParaUpload.name);
    this.http
      .post(environment.urlDaApi + 'api/Upload', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((data) => {
        if (data.type === HttpEventType.UploadProgress)
          this.progress = Math.round((100 * data.loaded) / data.total);
        else if (data.type === HttpEventType.Response) {
          this.message = 'Imagem carregada';
          this.onUploadFinished.emit(data.body);
        }
      });
  };

  public criarPathImg = (serverPath: string) => {
    console.log(serverPath);
    var valor = "/assets/img/default.jpg";

    if(serverPath == valor || serverPath.length > 1000){
      return serverPath;
    }
    else if(serverPath != ''){
      return environment.urlDaApi +`${serverPath}`;

    }
  };
}
