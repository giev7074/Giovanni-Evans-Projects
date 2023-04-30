#include <iostream>
#include <fstream>
#include <string>
#include "miniGit.hpp"
#include <sstream>
#include <iomanip>
#include <string>
#include <filesystem>


using namespace std;
namespace fs = std::filesystem;


// ~myClass();
myClass :: myClass(){
    head = NULL; 
}
 
void myClass:: showList()
{
    doublyNode *endnode = father;
    if(endnode != NULL)
    {
        while(endnode->next != NULL)
        {
            endnode = endnode->next;   
        }
    }
    singlyNode* crawler = father->head;
    if(crawler == NULL)
    {
        cout << "Nothing in the list" << endl;
        return;
    }
    while(crawler != NULL)
    {
        cout << "filename: " << crawler->fileName << endl;
        cout << "file version: " << crawler->fileVersion << endl;
        crawler = crawler->next;   
    }
}



void myClass:: addFiles(){
    string file_name;//declare
    cout << "Enter the file name:" << endl;
    // getline(cin, file_name);
    cin >> file_name;
    //user input for file name.....what is this for

    string file = file_name;//redundant
    ifstream inFile;//declare

    inFile.open(file);//open user inputed file
    
    //if-condition below needs to be irt to file name being in directory
    if(inFile.is_open()){//if file is in directory
        //functionality
        doublyNode* endNode = father;
        while (endNode->next != NULL)
        {
            endNode = endNode->next;
        }
        if (endNode->head == NULL){

            // cout << "hello" << endl;
            
            singlyNode *newNode = new singlyNode;
            newNode->fileName= file;
            newNode->fileVersion  = file + "_0";
            endNode->head = newNode;
            if(endNode->head!=NULL){
                cout << "File was added" << endl;
            }
            
            return;
        }
        
        singlyNode * crawler = endNode->head;//start of singleLL
        while(crawler != NULL){//while not at end
            //cout<<"TEST"<<endl;
            if(crawler->fileName == file){//if file is found
                cout << "This file already exists...You cannot add a file with the same name" << endl;
                cout << "Please try again" << endl;
                addFiles(); //call to function
            }
            crawler=crawler->next;//iterate
        }
        
        // cout << "TEST 2" << endl;
        singlyNode *newNode = new singlyNode;
        newNode->fileName= file;
        newNode->fileVersion  = file + "_0";
        singlyNode *crawler2 = endNode->head;//start of singly node
        while(crawler2->next != NULL){//while not at end
            crawler2 = crawler2->next;//iterate 
        }
        crawler2->next = newNode;
        newNode->next= NULL;
        crawler2 = NULL;
        cout << "File was added" << endl;
    }else{//if not open
        cout<<"File does not exist"<<endl;//output if file DNE
        addFiles(); //try againnnn
    }
}



void myClass:: removeFiles(){
    cout<<"Enter a file name"<<endl;//output
    string myFile="";//for file name
    cin>>myFile;//input for file name
    
    doublyNode* endNode = father;
    while (endNode->next != NULL)
    {
        endNode = endNode->next;
    }

    if(endNode->head == NULL)
    {
        cout << "There is nothing to delete" << endl;
        return;
    }

    singlyNode * current = endNode->head->next;//crawler for doubly
    singlyNode * previous = endNode->head;//1 instance prior to temp
    if(endNode->head->fileName == myFile)
    {
        singlyNode * temp = endNode->head;
        endNode->head = endNode->head->next;
        temp->next = NULL; 
    }
    while(current != NULL){//while temp is not at end of list
        if(current->fileName == myFile)//if filename=user input
        {
            previous->next = current->next;//delete the instance
            current = NULL;    
        }
        current=current->next;//iterate 
        previous = previous->next;//iterate 
    }
    cout << "File has been successfully removed!" << endl;
}

void myClass:: commit(){
    doublyNode* crawler = father;
    while(crawler->next != NULL)
    {
        crawler=crawler->next;
    }
    singlyNode * currentCrawler = crawler->head;

    while (currentCrawler != NULL){//while crawler not NULL
        if(fs::exists(".minigit/"+currentCrawler->fileVersion)){//if fileVersion exists
            ifstream inFile1;//declare
            string myString=currentCrawler->fileName;
            inFile1.open(myString);

            string myString1;
            string line;

            while(getline(inFile1, line)){//for not minigit
                myString1=myString1+line;
            }
            
            string x=".minigit/"+currentCrawler->fileVersion;
            ifstream inFile2;
            inFile2.open(x);

            string line1;
            string myString2;

            while(getline(inFile2, line1)){//for not minigit
               myString2=myString2+line1;
            }
            inFile2.close();
            inFile1.close();

            if(myString2 != myString1){//the situation the file was changed
                int versionNumber;
                for(int i = 0; i < currentCrawler->fileVersion.length(); i++)
                {
                    if(currentCrawler->fileVersion[i] == '_')
                    {
                        versionNumber = stoi(currentCrawler->fileVersion.substr(i+1));
                        currentCrawler->fileVersion = currentCrawler->fileVersion.substr(0, i+1);
                    }
                }
                versionNumber++;
                currentCrawler->fileVersion = currentCrawler->fileVersion + to_string(versionNumber);
                //copy the file into the minigit with the current version number....

                string file_name;//declare
                file_name = currentCrawler->fileName;
                ifstream inFile;

                inFile.open(file_name);
                
                if(inFile.is_open()){ 

                    string line;
                    string currentLine;

                    ofstream outFile;
                    string minigit_file;
                    minigit_file = ".minigit/"+currentCrawler->fileVersion;
                    outFile.open(minigit_file);
                    
                    while(getline(inFile, line)){//for not minigit
                        outFile << line << endl;
                    }   
                    outFile.close();
                    inFile.close();
                }
            }
        } else {
            string file_name;//declare
            file_name = currentCrawler->fileName;
            ifstream inFile;

            inFile.open(file_name);
            
            if(inFile.is_open()){ 

                string line;
                string currentLine;

                ofstream outFile;
                string minigit_file;
                minigit_file = ".minigit/"+currentCrawler->fileVersion;
                outFile.open(minigit_file);
                
                while(getline(inFile, line)){
                    //for not minigit
                    outFile << line << endl;
                }   
                outFile.close();
                inFile.close();
            }
        }
        currentCrawler = currentCrawler->next;
    }
    doublyNode* endNode = father;
    while (endNode->next != NULL)
    {
        endNode = endNode->next;
    }
    commitCounter++;
    doublyNode* nextNode = new doublyNode;
    nextNode->commitNumber = commitCounter;
    endNode->next = nextNode;
    nextNode->previous = endNode;
    nextNode->next = NULL;
    nextNode->head = NULL;  

    cout << "You successfully committed changes to the subdirectory!" << endl;
}


void myClass:: checkout(){
    int checkoutNum = 0;
    string choice = "";

    cout << "Would you like to checkout? (Keep in mind you will lose all current uncommitted changes)" << endl;
    cin >> choice;

    if (choice == "yes"){
        cout << "Please enter a commit number"<< endl;
        cin>>checkoutNum;
        doublyNode * crawler = father;//initialize doubly node

        while (crawler->next != NULL){
            if (crawler->commitNumber == checkoutNum){//if checkout num is found
               singlyNode* scrawler = crawler->head;
               //cout <<"hi";
               while(scrawler != NULL)
               {
                    ifstream inFile1;//declare
                    string myString = scrawler->fileName; //opening the current respository version
                    inFile1.open(myString);
                    inFile1.clear();
                    inFile1.close(); 

                    string x=".minigit/"+scrawler->fileVersion; //opening the minigit version
                    ifstream inFile2;
                    inFile2.open(x);

                    ofstream outFile;//declare
                    outFile.open(myString);
                
                    string line;
                    while(getline(inFile2, line)){
                        //for not minigit
                        outFile << line << endl;
                    }  
                    outFile.close();
                    inFile2.close();
                    scrawler = scrawler->next;
               }

            } 
            crawler = crawler->next;
        }
        if(crawler == NULL)
        {
            cout << "please enter a valid number" << endl;
            checkout();
        }

    }
    cout << "You have successfully checked out commit number " << checkoutNum << endl;
    string choice2;
    cout << "Are you done checking out?(yes/no)" << endl;
    cin >> choice2;
    if (choice2 == "yes"){
        return;
    } else {
        checkout();
    }

    
}
